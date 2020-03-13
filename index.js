//Creates necessary Discord connection
const Discord = require( 'discord.js' );
const bot = new Discord.Client();

//password to change bot
const token = 'Njg3MTAwNTIzNjM5MzQxMDcy.Xmg2Sg.VSGXtlgPaGugPvInFrzbLZPtLGc';

//set prefix
const PREFIX = '$';

//create date class
d = new Date();

// Teacher class
class Teacher 
{
    //Teacher constructor
    constructor( name ) 
    {
        this.Name = name;
        this.Assignments = [];
    }
    
    //getters
    getName()
    {
        return this.Name;
    }
    getAssignments()
    {
        return this.Assignments;
    }

    //Modifiers
    addAssignment( Assignment )
    {
        this.Assignments.push( Assignment );
    }
    removeAssignment( name )
    {
        //console.log( name );
        a = this.Assignments;
        let index = findIndex( a, name );
        //console.log( index );
        this.Assignments.splice( index );
    }
}

//Assignment class
class Assignment
{
    //Constructor
    constructor( name, date )
    {
        this.Name = name;
        this.Date = date;
    }

    //getters
    getName()
    {
        return this.Name;
    }
    getDate()
    {
        return this.Date;
    }
}

//List of teacher names
let teacherNames = [ 'Oliveira', 'Stearns', 'Calvert', 'Alvarez', 'Ramos', 'Villagomez', 'Gatewood', 
                     'Hickman', 'Kickham', 'Lockett', 'Thompson', 'Ton', 'Evans', 'Hope', 'Yanez', 
                     'Weiker', 'Mathewson', 'Katsman', 'Gillespie', 'Kim', 'Becker', 'Calvert(TOK)', 
                     'Cuffin', 'Daniels', 'Collomb', 'Thompson(DT)', 'Cabaloue', 'Halligan', 'Martin', 
                     'Esparza', 'Wang', 'Jiang' ];
//Creates teachers array
let Teachers = [];

//Fills Teachers array with Teacher names
teacherNames.forEach( fillTeachers );
function fillTeachers( item )
{
    Teachers.push( new Teacher( item ) );
}


//Test cmd print
bot.on('ready', () =>
{
    console.log( 'This bot is cool' );
    console.log( Teachers[15].getName() );
})

//Fucntion that finds the index of a value in a list
function findIndex( list, value )
{
    let i;

    for( i = 0; i < list.length; i++ )
    {
        if( list[i].getName() == value )
        {
            break;
        }
    }

    return i;
}

//Bubble Sort assignments based on date
function bubbleSortDate( a )
{
    n = a.length;
    for( i = 0; i < n - 1; i++ )
    {
        for( j = 0; j < n - i - 1; j++ )
        {
            x = a[j].getDate().split( '/' );
            y = a[ j + 1 ].getDate().split( '/' );
            //Compares month
            if( x[0] > y[0] )
            {
                temp = a[j];
                a[j] = a[ j + 1 ];
                a[ j + 1 ] = temp;
            }
            //Compares day
            else if ( x[0] == y[0] )
            {
                if( x[1] > y[1] )
                {
                    temp = a[j];
                    a[j] = a[ j + 1 ];
                    a[ j + 1 ] = temp;
                }
            }
        }
    }
}

//Checks if the assignment is legal
function checkLegal( list, a )
{
    daysOfYear = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    //Checks if date is legal
    dateParts = a.getDate().split( '/' );
    if( dateParts[0] > 12 || dateParts[0] < 1 )
    {
        return 'date';
    }
    if( dateParts[1] > daysOfYear[ dateParts[0] ] || dateParts[1] < 1 )
    {
        
        return 'date';
    }

    //Checks if the assignment is a repeat
    for( i = 0; i < list.length; i++ )
    {
        if( list[i].getName() == a.getName() )
        {
            
            return 'repeat';
        }
    }

    return 'good';
}

//Recieves message and coordinates output
bot.on('message', message=>
{
    //Splits string based on spaces
    let args = message.content.substring( PREFIX.length ).split( " " );

    //Creates args switch
    switch(args[0])
    {
        //Test ping
        case 'ping':
            message.channel.send( 'pong' );
            break;
        //Adds an assignment to the list
        case 'add':
            //Creates embed message
            const addEmbed = new Discord.MessageEmbed()
                .setTitle( 'Adding Assignment' )
                .addField( 'Teacher', args[1] )
                .addField( 'Assignment', args[2] )
                .addField( 'Due Date', args[3] );

            //Adds assignment
            a = new Assignment( args[2], args[3] );

            //Checks legality
            legal = checkLegal( Teachers[ findIndex( Teachers, args[1] ) ].getAssignments(), a );
            if(  legal == 'good' )
            {
                //Sends embed
                message.channel.send( addEmbed );
                
                //Adds the assignment then reorders the list
                Teachers[ findIndex( Teachers, args[1] ) ].addAssignment( a );
                bubbleSortDate( Teachers[ findIndex( Teachers, args[1] ) ].getAssignments() );
            }
            else if( legal == 'date' )
            {
                message.channel.send( "Double-check that your date is a valid one" );
            }
            else if( legal == 'repeat' )
            {
                message.channel.send( "Double-check that this assignment has not already been posted." );
            }

            break;
        //Removes an assignment to the list
        case 'remove':
            //Creates embed message
            const removeEmbed = new Discord.MessageEmbed()
                .setTitle( 'Removing Assignment' )
                .addField( 'Teacher', args[1] )
                .addField( 'Assignment', args[2] )
                .addField( 'Due Date', args[3] );
            message.channel.send( removeEmbed );

            //Removes assignment
            Teachers[ findIndex( Teachers, args[1] ) ].removeAssignment( args[2] );

            break;
        //Views all the assignments of a teacher
        case 'view':
            //Creates embed
            const viewEmbed = new Discord.MessageEmbed()
                .setTitle( 'Viewing Assignment' );

            //Adds all assignments of a certain teacher onto the embed
            a = Teachers[ findIndex( Teachers, args[1] ) ].getAssignments();
            for( i = 0; i < a.length; i++ )
            {
                num = i + 1;
                viewEmbed.addField( num, a[i].getDate() + ':   ' + a[i].getName() );
            }
            
            message.channel.send( viewEmbed );

            break;
    }
})

//Logs into the discord server
bot.login( token );