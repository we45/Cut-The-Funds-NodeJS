module.exports = {
    'mongoUri': "mongodb://localhost:27017/cut_the_funds",
    'secret': "aec12a48-720c-4102-b6e1-d0d873627899",
    'salt': 'secretSalt',
    'userPerms': ["view_project", "create_expense", "delete_expense", "view_expense", "modify_expense", "view_coupons"],
    'mgrPerms': ["create_project", "delete_project", "modify_project", "view_expense", "approve_expense", "view_project"],
    "uploadDir": "/Users/abhaybhargav/Documents/Code/node/cut_the_funds/uploads",
    "mysql_db": "127.0.0.1",
    "mysql_user": "root",
    "mysql_password": "hegemony86",
    "database":"expenses"
};
