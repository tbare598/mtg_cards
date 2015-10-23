import sqlite3
from CardInfoTuplesFromFile import *
from CardTable import CardTable

database = 'C:/Users/tbare598/Google Drive/Side Projects/Websites/MTG-Cards/SQLite/MTG.sqlite'
cardJSON = 'C:/Users/tbare598/Google Drive/Side Projects/Websites/MTG-Cards/jsons/ALLSETS.json'

tableDefs = {
    'T_CARD_SETS'       : CardTable('T_CARD_SETS',       10, getSetTupleList,           cardJSON),
    'T_CARDS'           : CardTable('T_CARDS',           15, getCardTupleList,          cardJSON),
    'T_CARD_SUPERTYPES' : CardTable('T_CARD_SUPERTYPES', 3,  getCardSupertypeTupleList, cardJSON),
    'T_CARD_TYPES'      : CardTable('T_CARD_TYPES',      3,  getCardTypesTupleList,     cardJSON),
    'T_CARD_SUBTYPES'   : CardTable('T_CARD_SUBTYPES',   3,  getCardSubtypesTupleList,  cardJSON),
    'T_CARD_COLORS'     : CardTable('T_CARD_COLORS',     3,  getCardColorsTupleList,    cardJSON)}


#TODO: SHOULD PASS THE FILE NAME INTO HERE, AND NOT GIVE IT TO THE CLASSES
def reloadFromJSONFile():
    for tableName in tableDefs.keys():
        print ''
        print 'Deleting from: ' + tableName
        deleteAll(tableName)
        print 'Inserting into: ' + tableName
        insertTableFromJSONFile(tableDefs[tableName])


def insertTableFromJSONFile(table):
    query = createInsertQuery(table.tableName, table.numOfCols)
    tupleList = table.tupleFunc(table.fileAddr)#TODO:SENDING THE FILE NAME IN, SHOULD ALREADY BE TAKEN CARE OF
    insert(tupleList,query)
    

def viewTupleList(tupleList):
    displayed = 0
    
    for keyList in tupleList:
        displayed += 1
        print keyList
        print ''
        print ''
        
        if displayed > 100:
            cont = raw_input('Continue?(y,n)')
            if not (cont == 'y' or cont == 'Y'):
                break
            else:
                displayed = 0

        
        
def viewSets():
    viewTupleList(getSetTupleList())
    
    
def viewCards():
    viewTupleList(getCardTupleList())
    
    
def viewSupertypes():
    viewTupleList(getCardSupertypeTupleList())
    
    
def viewCardTypes():
    viewTupleList(getCardTypesTupleList())
    
    
def deleteAll(tableName):
    db = sqlite3.connect(database)
    
    c = db.cursor()
    try:
        c.execute('DELETE FROM ' + tableName + ' WHERE 1=1;')
    except Exception:
        import traceback
        traceback.print_exc()
        print ''
        print insertQuery
        print keyList
        raise
            
    c.close()
    db.commit()
    
    

def insert(tupleList,insertQuery):
    db = sqlite3.connect(database)
    inserted = 0
    insertedMultiplier = 0
    
    for keyList in tupleList:
        inserted += 1
        
        c = db.cursor()
        try:
            c.execute(insertQuery, keyList)
        except Exception:
            import traceback
            traceback.print_exc()
            print ''
            print insertQuery
            print keyList
            raise
            
        c.close()
        if inserted >= 1000:
            print 'Inserted: ' + str(insertedMultiplier*1000 + inserted)
            inserted = 0
            insertedMultiplier += 1
    db.commit()
    

def createInsertQuery(tableName, numOfCols):
    query = 'insert into ' + tableName + ' values ('
    for i in range(numOfCols):
        query += '?,'
    
    #This also removes the last comma
    return (query[:-1] + ')' if numOfCols > 0 else query + ')')


    
    
if __name__ == "__main__":
    reloadFromJSONFile()
    