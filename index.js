//Creates necessary Discord connection
const Discord = require( 'discord.js' );
const bot = new Discord.Client();

//password to change bot
const token = 'Njg3MTAwNTIzNjM5MzQxMDcy.Xmg2Sg.VSGXtlgPaGugPvInFrzbLZPtLGc';

//set prefix
const PREFIX = '$';

//List of teacher names
const teacherNames = [ 'Oliveira', 'Stearns', 'Calvert', 'Alvarez', 'Ramos', 'Villagomez', 'Gatewood', 
                     'Hickman', 'Kickham', 'Lockett', 'Thompson', 'Ton', 'Evans', 'Hope', 'Yanez', 
                     'Weiker', 'Mathewson', 'Katsman', 'Gillespie', 'Kim', 'Becker', 'Calvert(TOK)', 
                     'Cuffin', 'Daniels', 'Collomb', 'Thompson(DT)', 'Cabaloue', 'Halligan', 'Martin', 
                     'Esparza', 'Wang', 'Jiang' ];

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
    removeAssignment( index )
    {
        //console.log( index );
        this.Assignments.splice( index );
    }
}

//create date class
d = new Date();

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
//Returns a number above the length of the list if the Teacher does not exist
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
function checkLegalAdd( list, a )
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
    let args = message.content.substring( PREFIX.length ).split( ' ' );

    //Finds the index of the requested Teacher
    //Oops it runs every message but it doesn't matter lol
    index = findIndex( Teachers, args[1] );
    if( Teachers[ index ] == undefined )
    {
        validIndex = false;
    }
    else
    {
        validIndex = true;
    }

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

            //Checks valid teacher
            if( validIndex )
            {
                //Checks legality
                legal = checkLegalAdd( Teachers[ index ].getAssignments(), a );
                if(  legal == 'good' )
                {
                    //Sends embed
                    message.channel.send( addEmbed );
                    
                    //Adds the assignment then reorders the list
                    Teachers[ index ].addAssignment( a );
                    bubbleSortDate( Teachers[ index ].getAssignments() );
                }
                else if( legal == 'date' )
                {
                    message.channel.send( 'Double-check that your date is a valid one' );
                }
                else if( legal == 'repeat' )
                {
                    message.channel.send( 'Double-check that this assignment has not already been posted.');
                }
                else if( !validIndex )
                {
                    message.channel.send( 'Double-check your Teacher\'s name' );
                }
            }
            else
            {
                message.channel.send( 'Double-check your Teacher\'s name' );
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
            
            //Checks valid teacher
            if( validIndex )
            {   
                //Checks valid assignment
                a = Teachers[ index ].getAssignments();
                if( a[ findIndex( a, args[2] ) ] != undefined )
                {
                    //Removes assignment
                    Teachers[ index ].removeAssignment( args[2] );
                    message.channel.send( removeEmbed );
                }
                else
                {
                    message.channel.send( 'Double-check that your assignment is a valid one' );
                }
            }
            else
            {
                message.channel.send( 'Double-check your Teacher\'s name' );
            }

            break;
        //Views all the assignments of a teacher
        case 'view':
            //Creates embed
            const viewEmbed = new Discord.MessageEmbed()
                .setTitle( 'Viewing Assignment' );

            if( validIndex )
            {
                //Adds all assignments of a certain teacher onto the embed
                a = Teachers[ index ].getAssignments();
                for( i = 0; i < a.length; i++ )
                {
                    num = i + 1;
                    viewEmbed.addField( num, a[i].getDate() + ':   ' + a[i].getName() );
                }

                message.channel.send( viewEmbed );
            }
            else
            {
                message.channel.send( 'Double-check your Teacher\'s name' );
            }

            break;
    }
})

//Logs into the discord server
bot.login( token );