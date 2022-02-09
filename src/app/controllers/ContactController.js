const ContactsRepository = require('../repositories/ContactsRepository');

class ContactController {
  async index(request, response) {
    // Listar os registros
    const { orderBy } = request.query;

    const contacts = await ContactsRepository.findAll(orderBy);

    response.json(contacts);
  }

  async show(request, response) {
    // Obter um registro
    const { id } = request.params;
    const contact = await ContactsRepository.findById(id);

    if (!contact) {
      return response.status(404).json({ error: 'User not found' });
    }

    response.json(contact);
  }

  async store(request, response) {
    // Criar novo registro
    const {
      name, email, phone, category_id,
    } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const contactAlreadyExists = await ContactsRepository.findByEmail(email);

    if (contactAlreadyExists) {
      return response.status(400).json({ error: 'This email is already taken' });
    }

    const newContact = await ContactsRepository.create({
      name,
      email,
      phone,
      category_id,
    });

    response.json(newContact);
  }

  async update(request, response) {
    // Editar um registro
    const { id } = request.params;
    const { name, email, phone } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const contactByIdExists = await ContactsRepository.findById(id);

    if (!contactByIdExists) {
      return response.status(404).json({ error: 'User not found' });
    }

    const contactByEmailExists = await ContactsRepository.findByEmail(email);

    if (contactByEmailExists && contactByIdExists !== id) {
      return response.status(400).json({ error: 'This email is already taken' });
    }

    const updatedContact = await ContactsRepository.update(id, {
      name,
      email,
      phone,
    });

    response.json(updatedContact);
  }

  async delete(request, response) {
    // Deletar um registro
    const { id } = request.params;
    const contact = await ContactsRepository.findById(id);

    if (!contact) {
      return response.status(404).json({ error: 'User not found' });
    }

    await ContactsRepository.delete(id);

    response.sendStatus(204);
  }
}

// Pattern Singleton, vamos criar somente uma instância dessa classe
module.exports = new ContactController();
