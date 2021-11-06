import getUsers from "./db.js";
import TablleBuilder from "./tableBuilder.js";

getUsers()
.then((res) => {
    let service = new TablleBuilder(res, 'root');
    service.build();
})
.catch(err => console.error(err));






