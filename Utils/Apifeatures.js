class Apifeatures{
    constructor(query, queryString){
        this.query=query
        this.queryString=queryString


        
    }

    filter(){
       
           let queryStr=JSON.stringify(this.queryString)
           queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`)
           let queryObj=JSON.parse(queryStr)


            
           let paramKeys=['price','actors','duration','directors','ratings','totalRating','releaseYear','releaseDate','genres','name']
            const queryParamsKeys= Object.keys(queryObj).every(key => paramKeys.includes(key));

            if(!queryParamsKeys){
                throw Error('invalid params key')
            }

            
            this.query=this.query.find(queryObj)//filtering
            return this
    }

    sort(){
        
        if (this.req.queryString.sort) {
            const sortBy=req.queryString.sort.split(',').join(' ')
            this.query=this.query.sort(sortBy)
        
        }else{
            this.query=this.query.sort('-__v')
        }

        return this
    }

    limitFields(){
        // //LIMITING FIELDS
            if (req.queryString.fields) {
                const fields=req.queryString.fields.split(',').join(' ')
                this.query=this.query.select(fields)
            
            }else{
                this.query=this.query.select('-__v')
            }

            return this
    }

    paginate(){
        const page=req.query.page*1 || 1
        const limit=req.query.limit*1 || 10
        //PAGE 1:1-10, PAGE 2:11-20, PAGE:3 21-30 ....
        let skip=(page-1)*limit
        query=query.skip(skip).limit(limit)

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