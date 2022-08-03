const classification = {
  cheeses: [
    'Cheddar',
    'Swiss',
    'Mozzarella',
    'Gouda',
    'Pepper Jack',
    'Colby Jack',
    'Cottage',
    'Feta',
    'Monterry Jack',
    'Paneer',
    'Parmesan',
    'Provolone',
    'Romano',
    'String Cheese',
    'Emmental',
    'Swiss',
  ],
}

const schema = {
  name: {
    label: 'Name',
    show: true,
    samples: ['Gouda', 'Swiss', 'Cheddar'],
    align: 'left',
  },
  year: {
    label: 'Year',
    type: 'year',
    show: true,
    samples: [2015, 2013, 2021],
  },
  origin: {
    label: 'Origin',
    type: 'suggest',
    options: classification.cheeses,
    show: true,
    samples: ['NetherLands', 'Switzerland', 'England'],
    align: 'left',
  },
  rating: {
    label: 'Rating',
    type: 'rating',
    show: true,
    samples: [4, 3, 4],
  },
  comments: {
    label: 'Comments',
    type: 'textarea',
    samples: ['Decsent, but often too expensive', 'Very clean taste, but too simple', 'One of the original cheese LEGENDS'],
  },
}

function clone(toBeCloned) {
  return JSON.parse(JSON.stringify(toBeCloned))
}

const express = require('express')
const app = express()
const Datastore = require('nedb')
const port = process.env.PORT || 3001

app.listen(port, () => console.log(`Server listening on Port: ${port}`))
app.use(express.static('build'))

app.use(express.json({ limit: '10mb' }))
const db = new Datastore('data.db')
const preset = new Datastore('schema.db')
db.loadDatabase()
preset.loadDatabase()
// db.insert(schema)  // just some debugging tools
// db.remove({}, {multi: true})

// db.find({}, (err, docs) => {
//   console.log(docs[0]._id)
// })

app.get('/api/data', (req, res) => {
  db.find({}, (err, docs) => {
    let data = clone(docs)
    delete data._id
    res.json(data)
  });
})

app.get('/api/data/preset', (req, res) => {
  preset.find({}, (err, docs) => {
    let data = clone(docs)
    delete data[0]._id
    res.json(data)
  })
})

app.post('/api/data', (req, res) => {
  db.remove({},{multi: true})
  db.insert(req.body)
})



