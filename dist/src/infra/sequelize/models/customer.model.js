import { Model, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
export class Customer extends Model {
}
// Sequelize init function
export function initCustomerModel(sequelize) {
    Customer.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: ()=>uuidv4(),
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: "unique_email_constraint",
                msg: "Este endereço de e-mail já está sendo utilizado."
            },
            validate: {
                isEmail: {
                    msg: "Por favor, insira um endereço de e-mail válido."
                }
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: {
                name: "unique_email_constraint",
                msg: "Este número de telefone já está sendo utilizado."
            },
            validate: {
                len: {
                    args: [
                        10,
                        11
                    ],
                    msg: "Número de telefone inválido."
                },
                is: {
                    args: /^[0-9]+$/i,
                    msg: "O número de telefone deve conter apenas números."
                }
            }
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [
                        3,
                        30
                    ],
                    msg: "O nome deve conter entre 3 e 30 caracteres."
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [
                        3,
                        30
                    ],
                    msg: "O sobrenome deve conter entre 3 e 30 caracteres."
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set (value) {
                if (value?.length < 8 || value?.length > 30) {
                    throw new Error("A senha deve conter entre 8 e 30 caracteres.");
                }
                this.setDataValue("password", value);
            }
        },
        role: {
            type: DataTypes.ENUM("admin", "backoffice", "customer"),
            allowNull: false,
            defaultValue: "customer"
        }
    }, {
        sequelize,
        modelName: "Customer",
        tableName: "Customers",
        hooks: {
            beforeSave: async (customer)=>{
                if (customer.changed("password")) {
                    const saltRounds = 10;
                    customer.password = await bcrypt.hash(customer.password, saltRounds);
                }
            }
        }
    });
    return Customer;
}

//# sourceMappingURL=customer.model.js.map