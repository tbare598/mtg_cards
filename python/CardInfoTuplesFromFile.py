def getSetTupleList(jsonFileAddr):
    import json
    jsonAllSets = json.load(open(jsonFileAddr))

    tupleList = []
    columns = ['name', 'gathererCode', 'oldCode', 'magicCardsInfoCode', 
               'releaseDate','border', 'type', 'block', 'onlineOnly']
            
    for setCode, data in jsonAllSets.iteritems():
        keyList = [setCode]
        
        if setCode[0] == 'p':
            continue
            
        for c in columns:
            if c == 'onlineOnly':
                if data.get(c):
                    keyVal = 1
                elif data.get(c) == False:
                    keyVal = 0
                else:
                    keyVal = None
            else:
                keyVal = data.get(c)
                
            keyList.append(keyVal)
                
        tupleList.append(tuple(keyList))
    
    return tupleList

        
def getCardTupleList(jsonFileAddr):
    import json
    jsonAllSets = json.load(open(jsonFileAddr))

    tupleList = []
    
    keys = ['number','name','manaCost','cmc','type','rarity','text','flavor',
            'artist','power','toughness','layout','imageName']
    
    #This will get each set
    for setCode, setData in jsonAllSets.iteritems():
        if setCode[0] == 'p':
            continue
            
        cardsFromSet = setData.get('cards')
        
        #Loop to iterate through each card from a set
        for card in cardsFromSet:
            #Put the multverseid and setCode in the list first
            keyList = [card.get('multiverseid'),setCode]
        
            #This gets each key name for a card
            for key in keys:
                keyVal = card.get(key)
                    
                keyList.append(keyVal)
                    
            tupleList.append(tuple(keyList))
    
    return tupleList

        
def getCardSupertypeTupleList(jsonFileAddr):
    import json
    jsonAllSets = json.load(open(jsonFileAddr))

    tupleList = []
    
    #This will get each set
    for setCode, setData in jsonAllSets.iteritems():
        if setCode[0] == 'p':
            continue
            
        cardsFromSet = setData.get('cards')
        
        #Loop to iterate through each card from a set
        for card in cardsFromSet:
            supertypesForCard = card.get('supertypes')
            mid = card.get('multiverseid')
            cardName = card.get('name')
            
            #Check if there are super types for the card
            if supertypesForCard is not None:
                for supertype in supertypesForCard:
                    keyList = [mid,cardName,supertype]
                            
                    tupleList.append(tuple(keyList))
    
    return tupleList

        
def getCardTypesTupleList(jsonFileAddr):
    import json
    jsonAllSets = json.load(open(jsonFileAddr))

    tupleList = []
    
    #This will get each set
    for setCode, setData in jsonAllSets.iteritems():
        if setCode[0] == 'p':
            continue
            
        cardsFromSet = setData.get('cards')
        
        #Loop to iterate through each card from a set
        for card in cardsFromSet:
            typesForCard = card.get('types')
            mid = card.get('multiverseid')
            cardName = card.get('name')
            
            #Check if there are super types for the card
            if typesForCard is not None:
                for type in typesForCard:
                    keyList = [mid,cardName,type]
                            
                    tupleList.append(tuple(keyList))
    
    return tupleList

        
def getCardSubtypesTupleList(jsonFileAddr):
    import json
    jsonAllSets = json.load(open(jsonFileAddr))

    tupleList = []
    
    #This will get each set
    for setCode, setData in jsonAllSets.iteritems():
        if setCode[0] == 'p':
            continue
            
        cardsFromSet = setData.get('cards')
        
        #Loop to iterate through each card from a set
        for card in cardsFromSet:
            subtypesForCard = card.get('subtypes')
            mid = card.get('multiverseid')
            cardName = card.get('name')
            
            #Check if there are super types for the card
            if subtypesForCard is not None:
                for subtype in subtypesForCard:
                    keyList = [mid,cardName,subtype]
                            
                    tupleList.append(tuple(keyList))
    
    return tupleList

       
def getCardColorsTupleList(jsonFileAddr):
    import json
    jsonAllSets = json.load(open(jsonFileAddr))

    tupleList = []
    
    #This will get each set
    for setCode, setData in jsonAllSets.iteritems():
        if setCode[0] == 'p':
            continue
            
        cardsFromSet = setData.get('cards')
        
        #Loop to iterate through each card from a set
        for card in cardsFromSet:
            colorsForCard = card.get('colors')
            mid = card.get('multiverseid')
            cardName = card.get('name')
            
            #Check if there are super types for the card
            if colorsForCard is not None:
                for color in colorsForCard:
                    keyList = [mid,cardName,color]
                            
                    tupleList.append(tuple(keyList))
    
    return tupleList
    