async function getUsers() {
  const res = await fetch('db/users.json');
  if (res.ok === true) {
    return res.json();
  }
  return Promise.reject(res.statusText);
}

export default getUsers;
