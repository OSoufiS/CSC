/**
 * The Builder interface specifies methods for creating the different parts of
 * the Product objects.
 */
interface Builder {
    startQueryAll():void;
    startQuerySpecific(query?: string):void;
    whereClause():void;
    andClause():void;
    scacParams(scac: string):void
    containerParams(container : string):void
    customerClause():void;
    //producePartC(): void;
}

/**
 * The Concrete Builder classes follow the Builder interface and provide
 * specific implementations of the building steps. Your program may have several
 * variations of Builders, implemented differently.
 */
export class ConcreteBuilderCSC implements Builder {
    private product: ApiBuilder;

    /**
     * A fresh builder instance should contain a blank product object, which is
     * used in further assembly.
     */
    constructor() {
        this.reset();
    }

    public reset(): void {
        this.product = new ApiBuilder();
        
    }

    /**
     * All production steps work with the same product instance.
     */
    public startQueryAll():void {
        this.product.parts.push('SELECT * FROM c ')
    }
    public startQuerySpecific(query?: string):void {
        this.product.parts.push(`SELECT ${query} FROM c `)

    }
    public whereClause():void{
        this.product.parts.push(' WHERE ')
        
    }
    public andClause():void {
        this.product.parts.push(' AND ')
        
    }
    public scacParams(scac: string):void{
        this.product.parts.push(`c.scac = '${scac}'`)
        
    }
    public containerParams(container : string):void{
        this.product.parts.push(`c.container = '${container}'`)

    }
    public customerClause(): void{
        this.product.parts.push(`c.customer = 'Customer1'`)
    }




    

    /*public producePartC(): void {
        this.product.parts.push('PartC1');
    }*/

    /**
     * Concrete Builders are supposed to provide their own methods for
     * retrieving results. That's because various types of builders may create
     * entirely different products that don't follow the same interface.
     * Therefore, such methods cannot be declared in the base Builder interface
     * (at least in a statically typed programming language).
     *
     * Usually, after returning the end result to the client, a builder instance
     * is expected to be ready to start producing another product. That's why
     * it's a usual practice to call the reset method at the end of the
     * `getProduct` method body. However, this behavior is not mandatory, and
     * you can make your builders wait for an explicit reset call from the
     * client code before disposing of the previous result.
     */
    public getQuery(): ApiBuilder {
        const result = this.product;
        this.reset();
        return result;
    }
}

/**
 * It makes sense to use the Builder pattern only when your products are quite
 * complex and require extensive configuration.
 *
 * Unlike in other creational patterns, different concrete builders can produce
 * unrelated products. In other words, results of various builders may not
 * always follow the same interface.
 */
class ApiBuilder {
    public parts: string[] = [];

    public createQuery(): string {
        console.log(`${this.parts.join(' ')}\n`);
        return `${this.parts.join(' ')}\n`
    }
}

/**
 * The Director is only responsible for executing the building steps in a
 * particular sequence. It is helpful when producing products according to a
 * specific order or configuration. Strictly speaking, the Director class is
 * optional, since the client can control builders directly.
 */
export class Director {
    private builder: Builder;

    /**
     * The Director works with any builder instance that the client code passes
     * to it. This way, the client code may alter the final type of the newly
     * assembled product.
     */
    public setBuilder(builder: Builder): void {
        this.builder = builder;
    }

    /**
     * The Director can construct several product variations using the same
     * building steps.
     */
    public apiCallWithNoParam(query?:string): void{
        if(query){
            this.builder.startQuerySpecific(query);
        }
        else{
            this.builder.startQueryAll();
        }
        this.builder.whereClause()
        this.builder.customerClause();
        
    }
    public apiCallWithOneParam(params, query?:string): void{
        if(!Object.keys(params).find(element => element =="container") && !Object.keys(params).find(element => element =="SCAC")){
            console.log("ERROR HANDLE - one params")
            throw new Error('Something bad happened');
        }
        else{
            if(query){
                this.builder.startQuerySpecific(query);
            }
            else{
                this.builder.startQueryAll();
            }
            this.builder.whereClause()
            if(params.container){
                this.builder.containerParams(params.container);
            }
            else if(params.SCAC){
                this.builder.scacParams(params.SCAC);
            }
            else {
                console.log("ERROR HANDLE - unknown param")
                throw new Error('Something bad happened');
            }
            this.builder.andClause();
            this.builder.customerClause();
            
        }
        
    }
    public apiCallWithTwoParam(params, query?: string): void{
        if(!Object.keys(params).find(element => element =="container") && !Object.keys(params).find(element => element =="SCAC")){
            console.log("ERROR HANDLE - 2 params")
            throw new Error('Something bad happened');
        }
        else{
            if(query){
                this.builder.startQuerySpecific(query);
            }
            else{
                this.builder.startQueryAll();
            }
            this.builder.whereClause()
    
    
            if(params.container){
                this.builder.containerParams(params.container);
                this.builder.andClause();
            }
            else{
                console.log("ERROR HANDLE- param not contianer")
                throw new Error('Something bad happened');
            }
            
            if(params.SCAC){
                this.builder.scacParams(params.SCAC);
            }
            else{
                console.log("ERROR HANDLE - param not SCAC")
                throw new Error('Something bad happened');
            }

            this.builder.andClause();
            this.builder.customerClause();
        }

        
        
    }


}

