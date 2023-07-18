export async function getClients() {
  try {
    const response = await fetch('http://localhost:3000/api/clients', {
      method: 'GET'
    });

    const result = await response.json();

    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  };
};

export async function sendClientData(client, method, id = null) {
  try {
    const response = await fetch(`http://localhost:3000/api/clients/${method === 'POST' ? '' : id}`, {
      method,
      body: JSON.stringify(client)
    });
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  };
};

export async function deleteClientItem(id) {
  try {
    await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.log(error);
  };
};
