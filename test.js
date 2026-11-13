function createBankAccount() {
    let balance = 8000;

    function checkBalance() {
        console.log("Your balance is", balance)
    }
    function deposit (depAmount) {
        if (depAmount <= 0) {
            return;
        } else {
            balance += depAmount;
            console.log("You account balance is", balance)
            return;
        }
    }
    function withdraw (amount) {
        if (amount <= 0) {
            return;
        }
        else {
            balance -= amount;
            console.log("Your updated balance is", balance)
            return;
        }
    }
    return {
        checkBalance: checkBalance,
        deposit: deposit,
        withdraw: withdraw
    };
};
const myAccount1 = createBankAccount()
const myAccount2 = createBankAccount()
myAccount1.deposit(2000);