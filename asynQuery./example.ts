import { Query } from "./be";
const query: Query = new Query("123.123.123.123", 19132);

query.getData()
    .then(data => {
        console.log(data);
        query.close();
    });
