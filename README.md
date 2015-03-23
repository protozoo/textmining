# Textmining

A set of tools for text mining and performing text analysis in Javascript. 

So far just a simple implementation of a Bag Of Words (BOW) model, as seen in chapter 10 of the excellent book 'Data Science for Business', by Foster Provost and Tom Fawcett.

This module has not been throughly tested and is a work in progress, so please report any bug or improvement suggestions.


## Installation
npm install textmining


## Usage

```javascript
// Import module
var tm = require('textmining');

// The text to be modelled, 
// William Blake's poem 'A Poison Tree'
var verses = [
	"I was angry with my friend:", 
	"I told my wrath, my wrath did end.", 
	"I was angry with my foe:", 
	"I told it not, my wrath did grow.",  
	"And I watered it in fears,", 
	"Night and morning with my tears;", 
	"And I sunned it with smiles,", 
	"And with soft deceitful wiles.",  
	"And it grew both day and night,", 
	"Till it bore an apple bright.", 
	"And my foe beheld it shine.", 
	"And he knew that it was mine,",  
	"And into my garden stole", 
	"When the night had veiled the pole;", 
	"In the morning glad I see", 
	"My foe outstretched beneath the tree.", 
];

// Build a Bag Of Words (automatically normalize and remove stop words in the process)
var bag = tm.bagOfWords( verses, true, true );

// Sort terms by global frequency and print the top 10
var termsByFrequency = bag.terms.sort(function(a,b){
	if( a.frequency > b.frequency ) 		return -1;
	else if( a.frequency < b.frequency ) 	return 1;
	else return 0;
});
console.log( termsByFrequency.slice(0, 10) );
/*
[
  { "term": "foe", 		"frequency": 3,     "idf": 2.6739764335716716   },
  { "term": "night", 	"frequency": 3,     "idf": 2.6739764335716716   },
  { "term": "angry", 	"frequency": 2,     "idf": 3.0794415416798357   },
  { "term": "told", 	"frequency": 2,     "idf": 3.0794415416798357   },
  { "term": "wrath", 	"frequency": 2,     "idf": 3.0794415416798357   },
  { "term": "did", 		"frequency": 2,     "idf": 3.0794415416798357   },
  { "term": "morning", 	"frequency": 2,     "idf": 3.0794415416798357   },
  { "term": "grow", 	"frequency": 1,     "idf": 3.772588722239781   },
  { "term": "watered", 	"frequency": 1,     "idf": 3.772588722239781   },
  { "term": "fears", 	"frequency": 1,     "idf": 3.772588722239781   }
]
*/

// Get terms in first verses
// 'frequency' (local) is the number of occurrences of that term in that specific verse
// 'tfidf' is the product of local frequency and IDF
var termsInFirstVerses = bag.documents.slice(0,4).map(function(d){ return d.terms })
console.log( termsInFirstVerses );
/*
[
  [
    {   "term": "angry",    "frequency": 1,  "tfidf": 3.0794415416798357 },
    {   "term": "friend",   "frequency": 1,  "tfidf": 3.772588722239781 }
  ],
  [
    {   "term": "told",     "frequency": 1,  "tfidf": 3.0794415416798357 },
    {   "term": "wrath",    "frequency": 2,  "tfidf": 6.1588830833596715 },
    {   "term": "did",      "frequency": 1,  "tfidf": 3.0794415416798357 },
    {   "term": "end",      "frequency": 1,  "tfidf": 3.772588722239781 }
  ],
  [
    {   "term": "angry",    "frequency": 1,  "tfidf": 3.0794415416798357 },
    {   "term": "foe",      "frequency": 1,  "tfidf": 2.6739764335716716 }
  ],
  [
    {   "term": "told",     "frequency": 1,  "tfidf": 3.0794415416798357 },
    {   "term": "wrath",    "frequency": 1,  "tfidf": 3.0794415416798357 },
    {   "term": "did",      "frequency": 1,  "tfidf": 3.0794415416798357 },
    {   "term": "grow",     "frequency": 1,  "tfidf": 3.772588722239781 }
  ]
]
 */



 

```

