

/**
 * Removes frequent (and probably norelevant) words from a given text
 * @param  {String} document Input string to get stopwords removed from it
 * @return {String} String with stopwords cleaned-out
 */
exports.removeStopWords = function( document ){
  var words = document.split(" ");
  var result = [];
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if( exports.stopwords.english[word] == true ){
      // do nothing, it's been stopped
    }else{
      result.push( word );
    }
  };
  return result.join(" ");
}

/**
 * Removes all punctuation from a text (maintains alphanumeric characters only)
 * @param  {String} document  Input string to get its punctuation removed
 * @return {String} String without puntuation
 */
exports.removePunctuation = function( document ){
  var result = document.replace( /[^\w\s]|_/g, "" );
  return result;
}


/**
 * Collapses consecutive white spaces in a string
 * @param  {String} document  Input string to be processed
 * @return {String} String free of multiple consecutive white spaces
 */
exports.removeMultipleWhiteSpaces = function( document ){
  var result = document.replace( /\s+/g, " " );
  return result;
}

/**
 * Normalizes a text converting it to lower case, removing punctuation and collapsing multiple consecutive white spaces
 * @param  {String} document  Incoming string to be normalized
 * @return {String} Normalized text
 */
exports.normalize = function( document ){
  var result;
  try{
    result = document.toLowerCase();
  }catch(e){
    console.log( "Error normalizing document ", document );
    return "";
  }
  result = exports.removePunctuation( result );
  result = exports.removeMultipleWhiteSpaces( result );
  return result;
}

/**
 * Looks for different terms in a text and returns a list of terms and their frequency
 * @param  {String} document  Text to be analized
 * @param  {Boolean}  normalize   Wether the incoming text should be normalized before performing analysys or not
 * @return {Array}  A List of objects with two properties: "term" (the term's name) and "frequency" (the number of instances in the provided text)
 */
exports.getTermsFrequency = function( document, normalize ){
  if( normalize )
    document = exports.normalize( document );
  var terms = [];
  var terms_ob = {};
  var words = document.split(" ");
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if( terms_ob[word] == undefined ){
        terms_ob[word] = { term:word, frequency:0 };
        terms.push( terms_ob[word] );
      }
      terms_ob[word].frequency++;
  };
  return terms;

}

exports.trim = function( str ){
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

/**
 * extracts list of words from a string
 * This is mostly a dummy function to match the method signature of another framework.
 * That's why we don't use most of the arguments
 */
exports.getWords = function( string, withoutRepetitions, stopWords, sortedByFrequency, includeLinks, limit, minSizeWords ){
  var rawWords = string.split( " " );
  var result = rawWords.filter( function( d ){
    var isLongEnough = minSizeWords == undefined || minSizeWords == 0 || d.length >= minSizeWords;
    return isLongEnough;
  } );
  return result;
}

exports.getNgrams = function( sentences, maxN ){
    var ngrams_obj = {};
    var ngrams = [];
    // Normalize sentences
    sentences.forEach( function( sentence, i ){
        sentences[i] = exports.normalize( sentence );
        sentences[i] = exports.trim( sentences[i] );
    });
    
    console.log( "num sentences: " + sentences.length );
    // get ngrams
    sentences.forEach( function( sentence, index ){
        var words = exports.getWords( sentence, null, null, null, null, null, 3 );
        for( var j=0; j<words.length; j++ ){
          // 1-gram
            var ngram_str = words[j];
            if( ngrams_obj[ngram_str] == undefined ){
                ngrams_obj[ngram_str] = { term:ngram_str, frequency:0, sentencesIndex:[], sentencesIndexDict:{} };
                ngrams.push( ngrams_obj[ngram_str] );
            }
            ngrams_obj[ngram_str].frequency++;
            // add sentence to n-gram's list, if not already present
            if( ngrams_obj[ngram_str].sentencesIndexDict[index] != true ){
              ngrams_obj[ngram_str].sentencesIndexDict[index] = true;
              ngrams_obj[ngram_str].sentencesIndex.push( index );
            }
            // n-gram
            var ngram = [words[j]];
            for( var k=j+1; k<Math.min( j+maxN, words.length); k++ ){
                ngram.push( words[k] );
                var ngram_str = ngram.join( " " );
                if( ngrams_obj[ngram_str] == undefined ){
                  ngrams_obj[ngram_str] = { term:ngram_str, frequency:0, sentencesIndex:[], sentencesIndexDict:{} };
                  ngrams.push( ngrams_obj[ngram_str] );
                }
                ngrams_obj[ngram_str].frequency++;
                // add sentence to n-gram's list, if not already present
                if( ngrams_obj[ngram_str].sentencesIndexDict[index] != true ){
                  ngrams_obj[ngram_str].sentencesIndexDict[index] = true;
                  ngrams_obj[ngram_str].sentencesIndex.push( index );
                }
            }
        }
    });
    return ngrams;
    
}

/**
 * Creates a "Bag Of Words" (BOW) model from a document corpus, 
 * including Term Frequency, Inverse Document Frequency (IDF) also known as Sparseness, and the product of these two (TFIDF)
 * @param  {Array}  documents   List of documents to construct the model
 * @param  {Boolean}  normalizeDocuments  Wether the incoming texts should be normalized before performing analysys or not
 * @param  {Boolean}  removeStopWords   Wether stopword removal should be applied or not
 * @return {Object} An object representing the Bag of Words. See documentation to learn about its structure
 */
exports.bagOfWords = function( documents, normalizeDocuments, removeStopWords ){
  var bag = {
    terms_by_key:{}, 
    terms:[], 
    documents:[]
  };
  // iterate all documents
  for (var i = 0; i < documents.length; i++) {
    // Clean it out ( if requested so)
    var doc_in = documents[i];
    var clean_doc_in = normalizeDocuments == true ? exports.normalize( doc_in ) : doc_in;
    clean_doc_in = removeStopWords == true ? exports.removeStopWords( clean_doc_in ) : clean_doc_in;
    // Create the resulting doc
    var doc_out = {
      text: doc_in, 
      normalized_text: clean_doc_in
    }
    // Comput terms for this document
    //doc_out.terms = exports.getTermsFrequency( clean_doc_in );
    //var sentences =  clean_doc_in.match( /[^\.!\?]+[\.!\?]+/g );
    var sentences = doc_out.sentences = clean_doc_in.match( /[^\.!\?]+[\.!\?]+/g );
    doc_out.terms = exports.getNgrams( sentences, 4 );


    // Save document
    bag.documents.push( doc_out );

    // Save terms in corpus
    for( var j=0; j<doc_out.terms.length; j++ ){
      var term = doc_out.terms[j].term;
      if( bag.terms_by_key[term] == undefined )
      {
        bag.terms_by_key[term] = { term:term, frequency:0 };
        bag.terms.push( bag.terms_by_key[term] );
      }
      bag.terms_by_key[term].frequency++;
    }
  };

  // Compute IDF (Inverse Document Frequency)
  for (var i = 0; i < bag.terms.length; i++) {
    var term_ob = bag.terms[i];
    var term = term_ob.term;
    var term_freq = term_ob.frequency;
    var term_idf = 1 + Math.log( bag.documents.length / term_freq );
    term_ob.idf = term_idf;
  };

  // Compute TFIDF (Term Frequency * Inverse Document Frequency)
  for (var i = 0; i < bag.documents.length; i++) {
    var document = bag.documents[i];
    var doc_terms = document.terms;
    for( var j=0; j<doc_terms.length; j++ ){
      var doc_term_ob = doc_terms[j];
      var doc_term = doc_term_ob.term;
      var doc_term_freq = doc_term_ob.frequency;
      var term_idf = bag.terms_by_key[doc_term].idf;
      var tfidf = doc_term_freq * term_idf;
      doc_term_ob.tfidf = tfidf;
    }
  };

  // sort terms by tfdif within each doc
  for (var i = 0; i < bag.documents.length; i++) {
    var document = bag.documents[i];
    var doc_terms = document.terms;
    document.terms = document.terms.sort( function(a,b){
      if( a.tfidf < b.tfidf )
        return 1;
      if( a.tfidf > b.tfidf )
        return -1;
      return 0;
    } )
  };

  // sort globalterms
  bag.terms = bag.terms.sort( function(a,b){
      if( a.frequency < b.frequency )
        return 1;
      if( a.frequency > b.frequency )
        return -1;
      return 0;
    } );

  return bag;
}



exports.stopwords = require("./stopwords.js").stopwords;







