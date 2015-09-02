$(document).ready(function(){

	$(document).on('apna:initialize', function(){
        //Initialize Database
		$_apna['db'] = window.sqlitePlugin.openDatabase({name: "apnabagconsumer.db", createFromLocation: 1});

        //Upgrade DB seamlessly
        setDBToLatestVersion();

        //DB is upto the state and it is ready for serving
		$(document).trigger('apna:DatabaseReady');
	});

    var SELECT_VERSION = 'SELECT max(version) as version FROM version;';
    var CREATE_VERSION = 'CREATE TABLE version( \'id\' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, \'version\' INTEGER NOT NULL UNIQUE, \'execute_date\' NUMERIC NOT NULL);'

    //Current version of the database, Keep update its version whenever new changes are added
    var CURRENT_VERSION = 1;

    //Version Specific SQLs
    var VERSION_1 = [
        //Copy the data from consumer to new consumer structure
        'ALTER TABLE consumer RENAME TO consumer_old;',
        'CREATE TABLE consumer ( id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, mobile TEXT NOT NULL UNIQUE, uuid TEXT NOT NULL,	prefer	INTEGER NOT NULL, pincode INTEGER NOT NULL, sync TEXT, codes TEXT);',
        "INSERT INTO consumer (id, mobile, uuid, prefer, sync, pincode, codes) SELECT id, mobile, uuid, prefer, sync, '000000', pincodes FROM consumer_old;",
        'drop table consumer_old;',
        //Update version number
        "INSERT INTO version (version, execute_date) VALUES(1, datetime('now','UTC'));"
    ];

    //Master list contains all versions
    var VERSIONS = [VERSION_1];

    //Some issue with version system. Either current version is not updated or master list is not updated
    if(CURRENT_VERSION !== VERSIONS.length){
        console.error('Error in versioning....................');
    }

    function setDBToLatestVersion(){
        $_apna.db.transaction(function(tx){
            function updateStructure(data, versionArr) {
                if(data < CURRENT_VERSION) {
                    //Remove already applied versions from the master list
                    versionArr = versionArr.slice(data, versionArr.length);
                    for(var i = 0; i < versionArr.length; i++) {
                        for(var j = 0; j < versionArr[i].length; j++) {
                            console.log('Executing...'+versionArr[i][j]);
                            tx.executeSql(versionArr[i][j]);
                        }
                    }
                }else{
                    console.log('Having latest version of DB');
                }
            }

            tx.executeSql('SELECT count(name) FROM sqlite_master where name=\'version\';', [], function(err,data){
                var versions = VERSIONS;
                //Is Version table available?
                if(data.rows.item(0) === 0){
                    console.log('No version table');
                    //No, create version table
                    versions = [[CREATE_VERSION]].concat(VERSIONS);
                    updateStructure(0, versions);
                }else{
                    console.log('Version table available');
                    //Select last version updated
                    tx.executeSql(SELECT_VERSION, [], function(error, innerData){
                        console.log('Inner data is :'+ (innerData.rows.item(0).version || 0));
                        //Execute all queries and sync it
                        updateStructure(innerData.rows.item(0).version || 0, VERSIONS);
                    });
                }
            }, function(error){
                console.log('Error in sqlite master '+error);
            })
        }, function(e){
            console.log('Error in tx :'+e);
        });
    }

});
