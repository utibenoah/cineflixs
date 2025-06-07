class Apifeatures{
    constructor(query, queryString){
        this.query=query
        this.queryString=queryString
        
    }
    

    filter(){
       
           const queryCopy = {...this.queryString};

        // Removing fields from the query
        const removeFields = ['sort', 'fields', 'q', 'limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el]);

        // Advance filter using: lt, lte, gt, gte

        

        
        let queryStr = JSON.stringify(queryCopy);
        
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        
        queryStr=JSON.parse(queryStr)

        this.query = this.query.find(queryStr);
        return this;
    }

    sort(){
        
        if (this.queryString.sort) {
            const sortBy=this.queryString.sort.split(',').join(' ')
            console.log(sortBy)
            this.query=this.query.sort(sortBy)
        
            
        }else{
            this.query=this.query.sort('-__v')
        }

        return this
        
    }

    limitFields(){
            if (this.queryString.fields) {
                const fields=this.queryString.fields.split(',').join(' ')
                this.query=this.query.select(fields)
            
            }else{
                this.query=this.query.select('-__v')
            }

            return this
    }


    paginate(){
        const page=this.queryString.page*1 || 1
        const limit=this.queryString.limit*1 || 10
        //PAGE 1:1-10, PAGE 2:11-20, PAGE:3 21-30 ....
        let skip=(page-1)*limit
        this.query=this.query.skip(skip).limit(limit)

    // if(req.query.page){
    //     const countDoc= await MovieModel.countDocuments()
    //     if(skip >=countDoc){
    //         throw Error('No more movies')
    //     }
    // }


        return this
    }
 }



module.exports=Apifeatures