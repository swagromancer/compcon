import { Capacitor } from '@capacitor/core'
import path from 'path'
import { promisify } from 'util'

const PLATFORM = Capacitor.platform
const platformNotSupportedMessage = `ERROR - PLATFORM NOT SUPPORTED: "${PLATFORM}" `

// variables used by electron
let fs: typeof import('fs')
let electron: typeof import('electron')
let userDataPath: string

if (PLATFORM == 'electron') {
  fs = require('fs')
  electron = require('electron')
  userDataPath = path.join((electron.app || electron.remote.app).getPath('userData'), 'data')
}

const writeFile = async function(name: string, data: string): Promise<void> {
  switch (PLATFORM) {
    case 'web':
      localStorage.setItem(name, data)
      break
    case 'electron':
      await promisify(fs.writeFile)(path.resolve(userDataPath, name), data)
      break
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

const readFile = async function(name: string): Promise<string> {
  switch (PLATFORM) {
    case 'web':
      return localStorage.getItem(name)
    case 'electron':
      console.log('IN ELECTRON!')
      console.log(path.resolve(userDataPath, name))
      return await promisify(fs.readFile)(path.resolve(userDataPath, name), 'utf-8')
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

const exists = async function(name: string): Promise<boolean> {
  switch (PLATFORM) {
    case 'web':
      return Boolean(localStorage.getItem(name))
    case 'electron':
      return await promisify(fs.exists)(path.resolve(userDataPath, name))
    default:
      throw new Error(platformNotSupportedMessage)
  }
}

const saveData = async function<T>(fileName: string, data: T) {
  return writeFile(fileName, JSON.stringify(data))
}

const loadData = async function<T>(fileName: string) {
  const dataText = await readFile(fileName)
  return (JSON.parse(dataText) || []) as T[]
}

const importData = function<T>(file: File): Promise<T> {
  return new Promise(resolve => {
    var fr = new FileReader()
    fr.onload = e => {
      resolve(JSON.parse((e.target as FileReader).result as string) as T)
    } // CHANGE to whatever function you want which would eventually call resolve
    fr.readAsText(file)
  })
}

const dataPathMap = {
  web: 'localStorage',
  electron: userDataPath,
}

const USER_DATA_PATH = dataPathMap[PLATFORM]

export { writeFile, readFile, saveData, loadData, importData, exists, USER_DATA_PATH }
