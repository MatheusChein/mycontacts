const { v4 } = require('uuid');

const db = require('../../database');

let contacts = [
  {
    id: v4(),
    name: 'Matheus Chein',
    email: 'matheuschein@email.com',
    phone: '123123123',
    category_id: v4(),
  },
  {
    id: v4(),
    name: 'Matheus Batista',
    email: 'matheuschein@email.com',
    phone: '123123123',
    category_id: v4(),
  },
  {
    id: v4(),
    name: 'Matheus Muniz',
    email: 'matheuschein@email.com',
    phone: '123123123',
    category_id: v4(),
  },
];

class ContactsRepository {
  async findAll(orderBy = 'ASC') {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const rows = await db.query(`SELECT * FROM contacts ORDER BY name ${direction}`);

    return rows;
  }

  async findById(id) {
    const [row] = await db.query('SELECT * FROM contacts WHERE id = $1', [id]);

    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query('SELECT * FROM contacts WHERE email = $1', [email]);

    return row;
  }

  delete(id) {
    return new Promise((resolve) => {
      contacts = contacts.filter((item) => item.id !== id);
      resolve();
    });
  }

  async create({
    name,
    email,
    phone,
    category_id,
  }) {
    // Esse modo de $1, $2 etc. é para evitar ataques de SQL injection
    const [row] = await db.query(`
      INSERT INTO contacts(name, email, phone, category_id)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `, [name, email, phone, category_id]);

    return row;
  }

  update(id, contact) {
    const { name, email, phone } = contact;

    return new Promise((resolve) => {
      let updatedContact = {
        name,
        email,
        phone,
      };

      contacts = contacts.map((item) => {
        if (item.id === id) {
          updatedContact = {
            ...item,
            name,
            email,
            phone,
          };
          return updatedContact;
        }

        return item;
      });

      resolve(updatedContact);
    });
  }
}

module.exports = new ContactsRepository();
