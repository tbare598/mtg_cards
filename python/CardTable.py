class CardTable:
    tableName = ''
    numOfCols = -1
    tupleFunc = None
    fileAddr = ''
    tupleList = None
    
    def __init__(self, initTableName, initNumOfCols, initTupleFunc, initFileAddr):
        self.tableName = initTableName
        self.numOfCols = initNumOfCols
        self.tupleFunc = initTupleFunc
        self.fileAddr  = initFileAddr
        
    
    def printTupleList(self):
        if self.tupleList is None:
            if self.tupleFunc is None:
                print 'ERROR: You need to set the tuple function before you'
                print '        can view this tuple list.'
                return
            
            elif self.fileAddr == '':
                print 'ERROR: You need to set the file location of the JSON'
                print '       file that contains the contents for this tuple.'
                return
                
            else:
                self.tupleList = self.tupleFunc(self.fileAddr)
                
        displayed = 0
        
        for keyList in self.tupleList:
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