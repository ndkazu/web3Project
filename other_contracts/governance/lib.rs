#![cfg_attr(not(feature = "std"), no_std, no_main)]
pub use self::governance::{
	Governance,
	GovernanceRef,
	ProposalType,
};

#[ink::contract]
mod governance {
use ink::{ prelude::vec::Vec, storage::Mapping, U256};

    #[derive(Debug, Clone, PartialEq)]
	#[ink::scale_derive(Encode, Decode, TypeInfo)]
	#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
	pub enum ProposalStatus {
		Submitted,
		Approved,
		Rejected,
		Executed,
	}

    #[derive(Debug, Clone, PartialEq)]
	#[ink::scale_derive(Encode, Decode, TypeInfo)]
	#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
	pub enum ProposalType {
		Spending,
		NewCouncilvoter,
		NewMentor,
	}

    #[derive(Debug, Clone)]
	#[ink::scale_derive(Encode, Decode, TypeInfo)]
	#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
	pub struct BasicInfo{
		/// Description of the proposal
		pub description: Vec<u8>,
		pub proposal_type: ProposalType,
		pub proposal_id: u32,
	}

    #[derive(Debug, Clone)]
	#[ink::scale_derive(Encode, Decode, TypeInfo)]
	#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
	pub struct Transaction {
		// The recipient of the proposal
		pub beneficiary: Address,
		// Amount of tokens to be awarded to the beneficiary
		pub amount: U256,
	}	

    #[derive(Debug, Clone)]
	#[ink::scale_derive(Encode, Decode, TypeInfo)]
	#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
	pub struct Spending {
		// The recipient of the proposal
		pub beneficiary: Address,
		// Amount of tokens to be awarded to the beneficiary
		pub amount: U256,
	}	

    #[derive(Debug, Clone)]
	#[ink::scale_derive(Encode, Decode, TypeInfo)]
	#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
	pub struct VoteInfos {
		// Beginnning of the voting period for this proposal
		pub start: BlockNumber,

		// End of the voting period for this proposal
		pub end: BlockNumber,

		// U256 representing the total votes for this proposal
		pub yes_votes: U256,

		// U256 representing the total votes against this proposal
		pub no_votes: U256,
	}

    /// Defines an event that is emitted every time a voter voted.  
	#[derive(Debug)]
	#[ink(event)]
	pub struct Vote {
		pub who: Option<Address>,
		pub when: Option<BlockNumber>,
	}


    /// Structure of the proposal used by the Dao governance sysytem
	#[derive(Debug, Clone)]
	#[ink::scale_derive(Encode, Decode, TypeInfo)]
	#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
	pub struct Proposal {
		/// Description of the proposal
		pub basic_infos: BasicInfo,
		/// Flag that indicates if the proposal was Executed
		pub status: ProposalStatus,
		/// Information related to voting
		pub votes: Option<VoteInfos>,
		// Information relative to proposal execution if approved
		pub transaction: Option<Transaction>,
        // owner of the proposal
        pub owner: Address,
	}

    impl VoteInfos {
		fn get_status(&self, mut proposal: Proposal) -> Proposal {
			if proposal.status == ProposalStatus::Submitted {
				if self.yes_votes > self.no_votes {
					proposal.status = ProposalStatus::Approved;
				} else {
					proposal.status = ProposalStatus::Rejected;
				}
			};
			proposal
		}

		fn update_votes(&mut self, approved: bool, voter: Voter) {
			match approved {
				true => {
					self.yes_votes =
						self.yes_votes.saturating_add(voter.voting_power);
				},
				false => {
					self.no_votes = self.no_votes.saturating_add(voter.voting_power);
				},
			};
		}
	}

    #[derive(Debug, Clone, Default)]
	#[ink::scale_derive(Encode, Decode, TypeInfo)]
	#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
	pub struct Voter {
		// Stores the voter's voting influence by using his U256
		pub voting_power: U256,

		// Keeps track of the last vote casted by the voter
		pub last_vote: BlockNumber,
	}

    /// Structure of a DAO (Decentralized Autonomous Organization)
	/// that uses Psp22 to manage the Dao treasury and funds projects
	/// selected by the voters through governance
	#[derive(Default)]
	#[ink(storage)]
	pub struct Governance {
		// Funding proposals
		proposals: Mapping<u32, Proposal>,

        // Mapping of Address to Voter structs, representing DAO votership.
		voters: Mapping<Address, Voter>,

		// Duration of the voting period
		voting_period: BlockNumber,

		// Number ofProposals created so far
		proposal_count: u32,
	}


    impl Governance {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(voting_period: BlockNumber) -> Self {
            Self {
				proposals: Mapping::default(),
                voters: Mapping::default(),
				voting_period,
				proposal_count: 0,
			}
        }

            /// A message that can be called on instantiated contracts.
        /// This one flips the value of the stored `bool` from `true`
        /// to `false` and vice versa.
        #[ink(message)]
        pub fn create_proposal(
            &mut self,
            description: Vec<u8>,
            proposal_type: ProposalType,
            beneficiary: Option<Address>,
            amount: U256,
        ) -> u32 {
            let proposal_id = self.proposal_count;
            let transaction = match proposal_type {
                ProposalType::Spending => {
                    Some(Transaction {
                        beneficiary: beneficiary.unwrap_or_default(),
                        amount,
                    })
                }
                _ => None,
            };

            let proposal = Proposal {
                basic_infos: BasicInfo {
                    description,
                    proposal_type,
                    proposal_id,
                },
                status: ProposalStatus::Submitted,
                votes: None,
                transaction,
                owner: ink::env::caller(),
            };
            self.proposals.insert(proposal_id, &proposal);
            self.proposal_count += 1;
            proposal_id
        }

        #[ink(message)]
		pub fn vote(&mut self, proposal_id: u32, approve: bool) -> Result<(), Error> {
			let caller = self.env().caller();
			let current_block = self.env().block_number();
			let mut proposal = self.proposals.get(proposal_id).ok_or(Error::ProposalNotFound)?;
			let mut vote_infos = proposal.votes.clone().ok_or(Error::ProblemWithTheContract)?;

			if current_block > vote_infos.end {
				// Update the Proposal status if needed
				proposal = vote_infos.get_status(proposal);
				self.proposals.insert(proposal.basic_infos.proposal_id, &proposal);
				return Err(Error::VotingPeriodEnded);
			}

			let voter = self.voters.get(caller).ok_or(Error::VoterNotFound)?;

			if voter.last_vote >= vote_infos.start {
				return Err(Error::AlreadyVoted);
			}

			vote_infos.update_votes(approve, voter.clone());
			proposal.votes = Some(vote_infos);

			self.proposals.insert(proposal_id, &proposal);

			self.voters.insert(
				caller,
				&Voter { voting_power: voter.voting_power, last_vote: current_block },
			);

			self.env().emit_event(Vote { who: Some(caller), when: Some(current_block) });

			Ok(())
		}

        #[ink(message)]
		pub fn update_proposal_status(&mut self, proposal_id: u32, executed:bool) -> Result<(), Error> {
            let mut proposal = self.proposals.get(proposal_id).ok_or(Error::ProposalNotFound)?;
            let vote_infos = proposal.votes.clone().ok_or(Error::ProblemWithTheContract)?;
            
			// Check the voting period
			if self.env().block_number() <= vote_infos.end {
				return Err(Error::VotingPeriodNotEnded);
			}

			
			if proposal.status == ProposalStatus::Executed {
				return Err(Error::ProposalExecuted);
			}			

			if vote_infos.yes_votes <= vote_infos.no_votes {
				proposal.status = ProposalStatus::Rejected;
				self.proposals.insert(proposal_id, &proposal);
				return Err(Error::ProposalRejected);
			} else {
				proposal.status = ProposalStatus::Approved;
				self.proposals.insert(proposal_id, &proposal);				
			}

			if executed==true {
				proposal.status = ProposalStatus::Executed;
				self.proposals.insert(proposal_id, &proposal);
			}           
				
            Ok(())
        }

		#[ink(message)]
		pub fn get_proposal(&self, proposal_id: u32) -> Result<Proposal, Error> {
			self.proposals.get(proposal_id).ok_or(Error::ProposalNotFound)
		}

        
    }

    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum Error {
        ProposalNotFound,
        ProblemWithTheContract,
        VotingPeriodEnded,
        AlreadyVoted,
        VoterNotFound,
		VotingPeriodNotEnded,
		ProposalExecuted,
		ProposalRejected,
    }
    /*


    /// This is how you'd write end-to-end (E2E) or integration tests for ink! contracts.
    ///
    /// When running these you need to make sure that you:
    /// - Compile the tests with the `e2e-tests` feature flag enabled (`--features e2e-tests`)
    /// - Are running a Substrate node which contains `pallet-contracts` in the backgvote_infos
    #[cfg(all(test, feature = "e2e-tests"))]
    mod e2e_tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// A helper function used for calling contract messages.
        use ink_e2e::ContractsBackend;

        /// The End-to-End test `Result` type.
        type E2EResult<T> = std::result::Result<T, Box<dyn std::error::Error>>;

        /// We test that we can upload and instantiate the contract using its default constructor.
        #[ink_e2e::test]
        async fn default_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            // Given
            let mut constructor = GovernanceRef::default();

            // When
            let contract = client
                .instantiate("governance", &ink_e2e::alice(), &mut constructor)
                .submit()
                .await
                .expect("instantiate failed");
            let call_builder = contract.call_builder::<Governance>();

            // Then
            let get = call_builder.get();
            let get_result = client.call(&ink_e2e::alice(), &get).dry_run().await?;
            assert!(matches!(get_result.return_value(), false));

            Ok(())
        }

        /// We test that we can read and write a value from the on-chain contract.
        #[ink_e2e::test]
        async fn it_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            // Given
            let mut constructor = GovernanceRef::new(false);
            let contract = client
                .instantiate("governance", &ink_e2e::bob(), &mut constructor)
                .submit()
                .await
                .expect("instantiate failed");
            let mut call_builder = contract.call_builder::<Governance>();

            let get = call_builder.get();
            let get_result = client.call(&ink_e2e::bob(), &get).dry_run().await?;
            assert!(matches!(get_result.return_value(), false));

            // When
            let flip = call_builder.flip();
            let _flip_result = client
                .call(&ink_e2e::bob(), &flip)
                .submit()
                .await
                .expect("flip failed");

            // Then
            let get = call_builder.get();
            let get_result = client.call(&ink_e2e::bob(), &get).dry_run().await?;
            assert!(matches!(get_result.return_value(), true));

            Ok(())
        }
    }*/


}
