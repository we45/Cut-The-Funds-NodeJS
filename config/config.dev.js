const mongo_ip = process.env.MONGO_IP || 'localhost';
const mysql_ip = process.env.MYSQL_IP || '127.0.0.1';
const mysql_user = process.env.MYSQL_USER || 'root';
const mysql_password = process.env.MYSQL_PASSWORD || 'hegemony86';
const mysql_database = process.env.MYSQL_DATABASE || 'expenses';
const upload_dir = '../uploads';

module.exports = {
    'mongoUri': "mongodb://"+mongo_ip+":27017/cut_the_funds",
    'secret': "aec12a48-720c-4102-b6e1-d0d873627899",
    'salt': 'secretSalt',
    'userPerms': ["view_project", "create_expense", "delete_expense", "view_expense", "modify_expense", "view_coupons", "create_card"],
    'mgrPerms': ["create_project", "delete_project", "modify_project", "view_expense", "approve_expense", "view_project"],
    "uploadDir": upload_dir,
    "mysql_db": mysql_ip,
    "mysql_user": mysql_user,
    "mysql_password": mysql_password,
    "database": mysql_database
};
