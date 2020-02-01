import express from 'express'
import { getJoke, getJokes, getRandomJoke } from './jokes'
import app from './app'

app.listen(8000, () => 
  console.log(`Listening on port 8000!`));
