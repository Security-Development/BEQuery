import { Query } from "./be";
const query: Query = new Query("jkonline.mcok.kr", 19132);

query.getData()
    .then(data => {
        console.log(data);
        query.close();
    });
