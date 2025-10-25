#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod dao {
    use governance::{GovernanceRef, ProposalType};
    use ink::codegen::TraitCallBuilder;
    use my_erc20::MyErc20Ref;
    use ink::{prelude::vec::Vec, storage::Mapping, U256, H256};

    pub const MINUTES: BlockNumber = 20;
    pub const HOURS: BlockNumber = MINUTES * 60;
    pub const DAYS: BlockNumber = HOURS * 24;

    #[derive(Debug, Clone)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct User {
        name: Vec<u8>,
        subscription: Subscription,
        mentor: bool,
        council: bool,
        institutional: bool,
        school: bool,
    }

    impl User {
        pub fn new(
            name: Vec<u8>,
            subscription: Subscription,
            institutional: bool,
            school: bool,
        ) -> Self {
            let amount = subscription_amount(subscription.subscription_type.clone());
            let start = ink::env::block_number::<Environment>();
            let end = start.saturating_add(DAYS * 30); // Example: 30 days subscription
            let active = true; // Assuming the subscription is active upon creation
            let subscription = Subscription {
                amount,
                start,
                end,
                active,
                subscription_type: subscription.subscription_type,
            };

            Self {
                name,
                subscription,
                mentor: false,  // Default value for mentor
                council: false, // Default value for council
                institutional,
                school,
            }
        }
    }

    #[derive(Debug, Clone)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct Subscription {
        amount: U256,
        start: BlockNumber,
        end: BlockNumber,
        active: bool,
        subscription_type: SubscriptionType,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub enum SubscriptionType {
        Free,
        Basic,
        Premium,
        Other,
    }

    #[derive(Debug, Clone, PartialEq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub enum Roles {
        Mentor,
        Council,
    }

    /// Defines an event that is emitted
    /// every time a subscription is created.
    #[derive(Debug)]
    #[ink(event)]
    pub struct SubscriptionCreated {
        pub who: Option<Address>,
        pub when: Option<BlockNumber>,
    }
    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct Dao {
        members: Mapping<Address, User>,
        erc20: MyErc20Ref,
        governance: GovernanceRef,
    }

    impl Dao {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(supply: ink::U256) -> Self {
            let erc20code_hash =  H256::from_slice(&hex_literal::hex!("5482c4cd758139eaebf1e0c5413b18ceaf0c54da6e9ae994fa333de2822edd67"));
            let governance_code_hash =  H256::from_slice(&hex_literal::hex!("7788fa424ec461f5074f3e929e965b77262380d0046a225c4add2303b94d2f03"));
            let erc20_contract = MyErc20Ref::new(supply)
                .code_hash(erc20code_hash)
                .endowment(0.into())
                .salt_bytes(Some([1u8; 32]))
                .instantiate();

            let governance_contract = GovernanceRef::new(50)
                .code_hash(governance_code_hash) // Replace with actual code hash
                .endowment(0.into())
                .salt_bytes(Some([2u8; 32]))
                .instantiate();
            Self {
                members: Mapping::default(),
                erc20: erc20_contract,
                governance: governance_contract,
            }
        }

        /// This message creates a new user's Subscription
        #[ink(message)]
        pub fn new_subscription(
            &mut self,
            name: Vec<u8>,
            subscription_type: SubscriptionType,
            institutional: bool,
            school: bool,
        ) -> Result<(), Error> {
            let caller = self.env().caller();
            // Get current block number
            let current_block = self.env().block_number();
            let amount = subscription_amount(subscription_type.clone());
            let subscription = Subscription {
                amount,
                start: current_block,
                end: current_block.saturating_add(DAYS * 30), // Example: 30 days subscription
                active: true,
                subscription_type,
            };
            let dao_account = self.env().address();
            let call_builder = self.erc20.call_mut();

            let member = self.members.get(caller);
            if !member.is_none() {
                return Err(Error::CanUpgradeOnly);
            }
            let user = User::new(name, subscription, institutional, school);

            self.members.insert(caller, &user);
            match user.subscription.subscription_type {
                SubscriptionType::Free => {}
                SubscriptionType::Basic | SubscriptionType::Premium | SubscriptionType::Other => {
                    let amount = user.subscription.amount; // Example amount for Basic
                    // Transfer the amount from the caller to the DAO account using transfer_from
                    let _transfer_result = call_builder
                        .transfer_from(caller, dao_account, amount.into())
                        .ref_time_limit(100000000000)
                        .proof_size_limit(10000000)
                        .storage_deposit_limit(500000000000u128.into())
                        .invoke();
                }
            }
            self.env().emit_event(SubscriptionCreated {
                who: Some(caller),
                when: Some(self.env().block_number()),
            });
            Ok(())
        }

        /// This message updates a user's Subscription
        #[ink(message)]
        pub fn update_subscription(&mut self, request: SubscriptionType) -> Result<(), Error> {
            let caller = self.env().caller();
            let mut member = self.members.get(caller).ok_or(Error::UserNotFound)?;
            match member.subscription.subscription_type {
                SubscriptionType::Free => {
                    // Update to basic
                    member.subscription.subscription_type = SubscriptionType::Basic;
                    let amount = subscription_amount(SubscriptionType::Basic); // Example amount for Basic
                    member.subscription.amount = amount;
                    member.subscription.start = self.env().block_number();
                    member.subscription.end = member.subscription.start.saturating_add(DAYS * 30); // Example: 30 days subscription
                    self.members.insert(caller, &member);
                    // Transfer the amount from the caller to the DAO account using transfer_from
                    let dao_account = self.env().address();
                    let call_builder = self.erc20.call_mut();

                    let _transfer_result = call_builder
                        .transfer_from(caller, dao_account, amount.into())
                        .ref_time_limit(100000000000)
                        .proof_size_limit(10000000)
                        .storage_deposit_limit(500000000000u128.into())
                        .invoke();
                }
                SubscriptionType::Basic => {
                    let amount = subscription_amount(request.clone()); // Example amount for Basic
                    match request {
                        SubscriptionType::Premium => {
                            member.subscription.subscription_type = request;
                            member.subscription.amount = amount;
                            member.subscription.start = self.env().block_number();
                            member.subscription.end =
                                member.subscription.start.saturating_add(DAYS * 30);
                        }
                        SubscriptionType::Other => {
                            member.subscription.subscription_type = request;
                            member.subscription.amount = amount;
                            member.subscription.start = self.env().block_number();
                            member.subscription.end =
                                member.subscription.start.saturating_add(DAYS * 30);
                        }
                        _ => return Err(Error::InvalidSubscription),
                    }
                    self.members.insert(caller, &member);
                    // Transfer the amount from the caller to the DAO account using transfer_from
                    let dao_account = self.env().address();
                    let call_builder = self.erc20.call_mut();

                    let _transfer_result = call_builder
                        .transfer_from(caller, dao_account, amount.into())
                        .ref_time_limit(100000000000)
                        .proof_size_limit(10000000)
                        .storage_deposit_limit(500000000000u128.into())
                        .invoke();
                }
                _ => {} // Submit to referendum
            }
            Ok(())
        }

        /// Request a spending proposal
        #[ink(message)]
        pub fn request_spending(
            &mut self,
            beneficiary: Address,
            amount:  U256,
            description: Vec<u8>,
        ) -> Result<(), Error> {
            let caller = self.env().caller();
            let member = self.members.get(caller).ok_or(Error::UserNotFound)?;
            if member.council != true && member.mentor != true {
                return Err(Error::NotAnAuthorisedUser);
            }
            // Create a proposal for spending request
            let call_builder = self.governance.call_mut();
            let _proposal = call_builder.create_proposal(
                description,
                ProposalType::Spending,
                Some(beneficiary),
                amount.into(), // Convert Balance to u128
            );

            Ok(())
        }
        /// Request a particular role
        #[ink(message)]
        pub fn request_role(&mut self, role: Roles, description: Vec<u8>) -> Result<(), Error> {
            // This function is a placeholder for requesting a role.
            let caller = self.env().caller();
            let member = self.members.get(caller).ok_or(Error::UserNotFound)?;
            if member.subscription.subscription_type != SubscriptionType::Premium {
                return Err(Error::NotPremiumUser);
            }
            match role {
                Roles::Mentor => {
                    //create a proposal for requesting Mentor role
                    let call_builder = self.governance.call_mut();
                    let _proposal = call_builder
                        .create_proposal(
                            description,
                            ProposalType::NewMentor,
                            Some(caller),
                            U256::from(0), // Placeholder for proposal parameters
                        )
                        .ref_time_limit(1000000)
                        .proof_size_limit(1000000)
                        .storage_deposit_limit(1000000.into())
                        .invoke();
                }
                Roles::Council => {
                    //create a proposal for requesting Mentor role
                    let call_builder = self.governance.call_mut();
                    let _proposal = call_builder
                        .create_proposal(
                            description,
                            ProposalType::NewMentor,
                            Some(caller),
                            U256::from(0), // Placeholder for proposal parameters
                        )
                        .ref_time_limit(1000000)
                        .proof_size_limit(1000000)
                        .storage_deposit_limit(1000000.into())
                        .invoke();
                }
            }
            Ok(())
        }

        /// Execute a proposal
        #[ink(message)]
        pub fn execute_proposal(&mut self, proposal_id: u32) -> Result<(), Error> {
            let caller = self.env().caller();
            let dao_account = self.env().address();
            let member = self.members.get(caller).ok_or(Error::UserNotFound)?;
            if member.council != true && member.mentor != true {
                return Err(Error::NotAnAuthorisedUser);
            }
            // Execute the proposal
            let call_builder = self.governance.call_mut();
            let proposal = call_builder
                .get_proposal(proposal_id)
                .ref_time_limit(1000000)
                .proof_size_limit(1000000)
                .storage_deposit_limit(1000000.into())
                .invoke()
                .map_err(|_| Error::ProposalNotFound)?;

            let _ = call_builder
                .update_proposal_status(proposal_id, false)
                .ref_time_limit(1000000)
                .proof_size_limit(1000000)
                .storage_deposit_limit(1000000.into())
                .invoke();
            let proposal_type = proposal.basic_infos.proposal_type;
            let owner_id = proposal.owner;

            match proposal_type {
                ProposalType::Spending => {
                    let transaction = proposal
                        .transaction
                        .clone()
                        .ok_or(Error::InvalidSubscription)?;
                    let beneficiary = transaction.beneficiary;
                    let amount = transaction.amount;
                    // Transfer the amount to the beneficiary
                    let call_builder = self.erc20.call_mut();
                    let _transfer_result = call_builder
                        .transfer_from(dao_account, beneficiary, amount.into())
                        .ref_time_limit(1000000)
                        .proof_size_limit(1000000)
                        .storage_deposit_limit(1000000.into())
                        .invoke();
                    Ok(())
                }
                ProposalType::NewCouncilvoter => {
                    // Change user's role to council
                    let mut owner = self.members.get(owner_id).ok_or(Error::UserNotFound)?;
                    owner.council = true;
                    self.members.insert(owner_id, &owner);
                    Ok(())
                }
                ProposalType::NewMentor => {
                    let mut owner = self.members.get(owner_id).ok_or(Error::UserNotFound)?;
                    owner.mentor = true;
                    self.members.insert(owner_id, &owner);
                    Ok(())
                }
            }
        }

        /// Get user information
        #[ink(message)]
        pub fn get_user(&self, account: Address) -> Option<User> {
            self.members.get(account)
        }

        /// Debug method to get the caller's address as seen by the contract
        #[ink(message)]
        pub fn get_caller_address(&self) -> Address {
            self.env().caller()
        }

        /// Debug method to get user by caller (uses env().caller())
        #[ink(message)]
        pub fn get_my_subscription(&self) -> Option<User> {
            let caller = self.env().caller();
            self.members.get(caller)
        }

        /// Helper function to approve the DAO contract to spend caller's tokens
        /// This allows users to approve token spending in one transaction
        #[ink(message)]
        pub fn approve_dao(&mut self, amount: U256) -> Result<(), Error> {
            let dao_account = self.env().address();

            // Call the ERC20 approve function
            let call_builder = self.erc20.call_mut();
            let _approve_result = call_builder
                .approve(dao_account, amount)
                .ref_time_limit(1000000)
                .proof_size_limit(1000000)
                .storage_deposit_limit(1000000.into())
                .invoke();

            Ok(())
        }
    }

    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum Error {
        SubscriptionAlreadyExists,
        UserNotFound,
        InsufficientFunds,
        CanUpgradeOnly,
        InvalidSubscriptionAmount,
        InvalidSubscription,
        NotPremiumUser,
        NotAnAuthorisedUser,
        ProposalNotFound,
    }

    pub fn subscription_amount(subscription: SubscriptionType) -> U256 {
        match subscription {
            SubscriptionType::Free => U256::from(0),
            SubscriptionType::Basic => U256::from(1000), // Example amount for Basic
            SubscriptionType::Premium => U256::from(5000), // Example amount for Premium
            SubscriptionType::Other => U256::from(10000), // Example amount for Other
        }
    }
    /// Unit tests in Rust are normally defined within such a `#[cfg(test)]`
    /// module and test functions are marked with a `#[test]` attribute.
    /// The below code is technically just normal Rust code.
    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        #[ink::test]
        fn test_new_subscription() {
            let mut dao = Dao::new();
            let subscription = Subscription {
                amount: Some(1000),
                start: 0,
                end: 30,
                active: true,
                subscription_type: SubscriptionType::Basic,
            };
            dao.new_subscription(b"test_user".to_vec(), subscription, false, false);
            let emitted_events = ink::env::test::recorded_events().collect::<Vec<_>>();
            assert_eq!(1, emitted_events.len());
        }

        #[ink::test]
        fn test_update_subscription() {
            //fund caller wallet
            let mut dao = Dao::new();
            let caller = ink::env::test::default_accounts().alice;
        }
    }
}
