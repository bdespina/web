/* const { Sequelize } = require('sequelize'); */

const { Model, Sequelize } = require("sequelize");
const sequelize = require('../db');

class har extends Model {}
har.init(
 {
    const :Entries = sequelize.define('entries', {
        // instantiating will automatically set the flag to true if not set
        startedDateTime: { type: Sequelize.DATE, allowNull: false, unique: true },
       
    
        serverIPAddress: { type: Sequelize.STRING, allowNull: false },
       
        // setting allowNull to false will add NOT NULL to the column, which means an error will be
        // thrown from the DB when the query is executed if the column is null. If you want to check that a value
        // is not null before querying the DB, look at the validations section below.
        tim_id: { type: Sequelize.INTEGER, allowNull: false, unique: true, primaryKey: true },
       
        entries_code: { type: Sequelize.INTEGER,  allowNull: false, unique: true, primaryKey: true }
       
    },),

    const: Timings = sequelize.define('timings', {  
        wait : {type: Sequelize.FLOAT, allowNull: false, unique: true, primaryKey: true },
        // It is possible to create foreign keys:
       timings_id : {
        type: Sequelize.INTEGER,
        allowNull: false, 
        unique: true, 
        primaryKey: true, 

        references: {
     // This is a reference to another model
      model: Entries,

     // This is the column name of the referenced model
     key: 'tim_id',

     // This declares when to check the foreign key constraint. PostgreSQL only.
     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        
       }
   }

    },),

    const: Request= sequelize.define('request', {
        method: {type: Sequelize.STRING, allowNull: false },
        url : {type: Sequelize.STRING, allowNull: false, unique: true },
        head_id : { type: Sequelize.INTEGER,  allowNull: false, unique: true, primaryKey: true  },
         // It is possible to create foreign keys:
        ent_code : {
        type: Sequelize.INTEGER,
        allowNull: false, 
        unique: true, 
        primaryKey: true, 
        

        references: {
     // This is a reference to another model
      model: Entries,

     // This is the column name of the referenced model
     key: 'entries_code',

     // This declares when to check the foreign key constraint. PostgreSQL only.S
     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        
       }
   }

       
            
    },),

    const: Response = sequelize.define('response', {   
           status : { type: Sequelize.INTEGER,  allowNull: false, unique: true },
           statusText: {type: Sequelize.STRING,  allowNull: false, unique: true },
           hdrs_id : {type: Sequelize.INTEGER,  allowNull: false, unique: true, primaryKey: true  },

            // It is possible to create foreign keys:
        en_code : {
            type: Sequelize.INTEGER,
            allowNull: false, 
            unique: true, 
            primaryKey: true, 
            
    
            references: {
         // This is a reference to another model
          model: Entries,
    
         // This is the column name of the referenced model
         key: 'entries_code',
    
         // This declares when to check the foreign key constraint. PostgreSQL only.S
         deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            
           }
       }



    },),
    const: Headers_request = sequelize.define('headers_request', {  
            content_type : {type: Sequelize.INTEGER,  allowNull: false, unique: true },
            cache_control: {type: Sequelize.STRING,  allowNull: false },
            pragma: {type: Sequelize.STRING,  allowNull: false, unique: true },
            expires: { type: Sequelize.DATE, allowNull: false, unique: true  },
            age: {type: Sequelize.INTEGER,  allowNull: false, unique: true },
            last_modified : {type: Sequelize.DATE, allowNull: false, unique: true },
            host: { type: Sequelize.STRING,  allowNull: false, unique: true},
             // It is possible to create foreign keys:
          headers_id : {
            type: Sequelize.INTEGER,
            allowNull: false, 
            unique: true, 
            primaryKey: true, 
            
    
            references: {
         // This is a reference to another model
          model: Request,
    
         // This is the column name of the referenced model
         key: 'head_id',
    
         // This declares when to check the foreign key constraint. PostgreSQL only.S
         deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            
           }
       }
    },),

        const: Headers_response = sequelize.define('headers_response', {  
        content_type : {type: Sequelize.INTEGER,  allowNull: false, unique: true },
        cache_control: {type: Sequelize.STRING,  allowNull: false },
        pragma: {type: Sequelize.STRING,  allowNull: false, unique: true },
        expires: { type: Sequelize.DATE, allowNull: false, unique: true  },
        age: {type: Sequelize.INTEGER,  allowNull: false, unique: true },
        last_modified : {type: Sequelize.DATE, allowNull: false, unique: true },
        host: { type: Sequelize.STRING,  allowNull: false, unique: true},
         // It is possible to create foreign keys:
      hea_id : {
        type: Sequelize.INTEGER,
        allowNull: false, 
        unique: true, 
        primaryKey: true,         

        references: {
     // This is a reference to another model
      model: Response,

     // This is the column name of the referenced model
     key: 'hdrs_id',

     // This declares when to check the foreign key constraint. PostgreSQL only.S
     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        
       }
   }
  },),




},
{
    sequelize,
    modelName: "har"
  }
);

    
module.exports = har;
 
