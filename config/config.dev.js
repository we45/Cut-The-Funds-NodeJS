module.exports = {
    'mongoUri': "mongodb://localhost:27017/cut_the_funds",
    'secret': "aec12a48-720c-4102-b6e1-d0d873627899",
    'salt': 'secretSalt',
    'userPerms': ["view_project", "create_expense", "delete_expense", "view_expense", "modify_expense", "view_coupons"],
    'mgrPerms': ["create_project", "delete_project", "modify_project", "view_expense", "approve_expense"]
};
