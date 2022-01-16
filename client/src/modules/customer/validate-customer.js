export default function validateCustomer(customer) {
  let validated = {
    customer: {},
    errors: []
  }

  let validatedCustomer = true;

  if (!customer.title || typeof customer.title !== 'string') {
    validated.errors.push({ code: 1, message: 'Наименование', customer });
    validatedCustomer = false;
  }

  if (!customer.phone || typeof customer.phone !== 'string') {
    validated.errors.push({ code: 2, message: 'Телефон', customer });
    validatedCustomer = false;
  }

  if (customer.phone && typeof customer.phone == 'string') {
    const phoneDigitsOnly = customer.phone.replace(/[^0-9]/g, '');

    if (phoneDigitsOnly.length !== 11) {
      validated.errors.push({ code: 3, message: 'Телефон', customer });
      validatedCustomer = false;
    } else {
      customer.phone = phoneDigitsOnly;
    }
  }

  if (!customer.fields || !Array.isArray(customer.fields)) {
    validated.errors.push({ code: 4, message: 'Массив fields обязателен, даже если он пустой', customer });
    validatedCustomer = false;
  }

  if (validatedCustomer) validated.customer = customer;

  return validated;
}