import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos";
import { Director, ConcreteBuilderCSC } from '../sharedCode/API_Builder';
require('dotenv').config();


/**
 * Set up CosmosDB
 */
const config = {
    endpoint: process.env.COSMOS_DB_HOST,
    key: process.env.COSMOS_DB_KEY,
    databaseId: "CSC-db",
    containerId: "shippingInfo",
    partitionKey: { kind: "Hash", paths: ["/container"] }
};
const { endpoint, key, databaseId, containerId } = config;
const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);


/**
 * 
 * HTTP Trigger that sets up the entire API 
 */
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const params = req.query
    let response = [];
    context.log('HTTP trigger function processed a request');
    const name = (req.query.name || (req.body && req.body.name));

    /**
     * Utilises the Builder Pattern to build out the API call
     */
    let query;
    const director = new Director();
    const builder = new ConcreteBuilderCSC();
    director.setBuilder(builder);
    //console.log(Object.keys(params).length)
    try {
        switch (Object.keys(params).length) {
            case 0:
                director.apiCallWithNoParam();
                break;
            case 1:
                director.apiCallWithOneParam(params);
                break;
            case 2:
                director.apiCallWithTwoParam(params);
                break;
            default:
                //console.log("arrived at defualt")
                context.res = {
                    status: 500, /* Defaults to 200 */
                    body: 'Item not found'
                };
                context.done();
                break;
        }
    }
    catch (err) {
        context.res = {
            status: 500, /* Defaults to 200 */
            body: 'Item not found'
        };
        context.done();
    }


    query = builder.getQuery().createQuery();
    // query to return all items
    const querySpec = {
        query: query
    };
    console.log(querySpec)

    // read all items in the Items container
    try {
        const { resources: items } = await container.items
            .query(querySpec)
            .fetchAll();

        items.forEach(item => {
            console.log(`${item.container} - ${item.scac}`);

            response.push(item);
        });
    }
    catch (err) {
        console.log(err.message)
    }

    const responseMessage = response;

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
    context.done();

};



export default httpTrigger;