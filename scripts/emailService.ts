'use strict'
const fetchDataLib = require('./fetchData')
const fs = require('fs')
import { parseHtmlFile } from './htmlParser'
import { Project } from './projectType'
import { ProjectDictionary } from './projectType'
import { EmailSender } from './emailSender'

async function main() {
  let oldProjectsFromDB: Project[] = []
  const emailer: EmailSender = new EmailSender()
  let Currentday = new Date().getDate()
  let Yesterday = 0
  let dayChanged: boolean = true

  while (true) {
    console.log(new Date(), "Fetching new data...");
    
    
    //only send the limit and warning emails once a day
    Currentday = new Date().getDate()
    if (Yesterday != Currentday) {
      console.log(new Date(), "Day changed...Sending email if limit is reached.");
      dayChanged = true
      Yesterday = Currentday
    }

    const dbResponse = await fetchDataLib.fetchData()
    if (dbResponse.status == 500) {
      console.log(new Date(),
        'Could not read the data from database, please check the error message below:',
      )
      console.log(new Date(), dbResponse.message)
      continue
    }

    const projectsFromDB: Project[] = dbResponse.message
    let projectsNeedMaintenance: ProjectDictionary[] = []

    projectsNeedMaintenance = checkProjectsData(
      projectsFromDB.slice(),
      oldProjectsFromDB.slice(),
    )

    const htmlRawContent = ReadContentFile()
    projectsNeedMaintenance.map(async (item: ProjectDictionary) => {
      let Subject = ''
      switch (item.issue) {
        case 'reset':
          Subject = 'Conter value for has been changed'
          break
        case 'limit':
          Subject = 'The equipment has exceeded the maximum contacts limit'
          break
        case 'warning':
          Subject = 'The equipment has exceeded the maximum contact limit'
          break
        case 'limit_change':
          Subject = 'The limits for the equipment have been modified'
          break 
        case 'owner_change':
          Subject = 'The owner for the equipment has been modified'
          break

        default:
          Subject =
            'If you receive this error, please contact your administrator!'
          break
      }

      const htmlContent = parseHtmlFile(htmlRawContent, item)

      if (dayChanged && (item.issue == 'limit' || item.issue == 'warning')) {
        console.log(new Date(),
          'Sending email for Alert: ',
          item.issue,
          ' with Project name: ',
          item.project.project_name,
          ' Adapter code: ',
          item.project.adapter_code,
          ' Fixture type: ',
          item.project.fixture_type,
        )

        const emailSent = await emailer.sendEmail(
          item.project.owner_email,
          Subject,
          JSON.stringify(item),
          htmlContent,
        )

        if (emailSent) {
          console.log(new Date(), `Email sent!`)
          dayChanged = false
        }
      }

      if (
        item.issue == 'reset'
      ) {
        console.log(new Date(),
          'Sending email for Alert: ',
          item.issue,
          ' with Project name: ',
          item.project.project_name,
          ' Adapter code: ',
          item.project.adapter_code,
          ' Fixture type: ',
          item.project.fixture_type,
        )

        const emailSent = await emailer.sendEmail(
          item.project.owner_email,
          Subject,
          JSON.stringify(item),
          htmlContent,
        )

        if (emailSent) {
          console.log(new Date(), `Email sent!`)
        }
      }
      if (
        (item.issue == 'limit_change' || item.issue == 'owner_change')
      ) {
        console.log(new Date(),
          'Sending email for Alert: ',
          item.issue,
          ' with Project name: ',
          item.project.project_name,
          ' Adapter code: ',
          item.project.adapter_code,
          ' Fixture type: ',
          item.project.fixture_type,
        )

        const emailSent = await emailer.sendEmail(
          item.project.owner_email,
          Subject,
          JSON.stringify(item),
          htmlContent,
        )

        if (emailSent) {
          console.log(new Date(), `Email sent!`)
        }
      }
    })

    await sleep(1000 * 60 * 15);
    oldProjectsFromDB = projectsFromDB.slice()
  }
}

main().catch(console.error)

const sleep = (time_ms: number) =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, time_ms)
  })

const ReadContentFile = (): string => {
  try {
    return fs.readFileSync('./html/emailContent.html', 'utf8')
  } catch (err) {
    console.error(err)
  }
  return ''
}

/*
The following function will return a list of projects that have out of boundaries values,
if one project has exceeded its temperature -> add the project to the list
if one project has changed its temperature by 3 deg from previous -> add the project to the list
if one project has its contacts greater than limit -> add the project to the list and skip checking for warning (limit > contacts)
if one project has its contacts greater than warning -> add the project to the list ONLY IF the value of limit was not exceeded(warning > contacts < limit) 
*/
const checkProjectsData = (
  projects: Project[],
  oldProjectsFromDB: Project[],
): ProjectDictionary[] => {
  let projectsNeedMaintenance: ProjectDictionary[] = []

  projects.map((item) => {
        //map over all the old projects and check if the temperature changed by 3 deg.
        oldProjectsFromDB.map((oldItem) => {
          if (
            oldItem.adapter_code === item.adapter_code &&
            oldItem.fixture_type === item.fixture_type
          ) {
            if (
              item.resets - oldItem.resets > 0
            ) {
              const itemDictionary: ProjectDictionary = {
                issue: 'reset',
                project: item,
              }
              console.log(new Date(), `!!!!Contacts were reseted!!!!`)
              projectsNeedMaintenance.push(itemDictionary)
            }
          }
          if (
            oldItem.adapter_code === item.adapter_code &&
            oldItem.fixture_type === item.fixture_type
          ) {
            if (
              item.contacts_limit != oldItem.contacts_limit ||
              item.warning_at != oldItem.warning_at 
            ) {
              const itemDictionary: ProjectDictionary = {
                issue: 'limit_change',
                project: item,
              }
              console.log(new Date(), `Limits were changed!`)
              projectsNeedMaintenance.push(itemDictionary)
            }
          }
          if (
            oldItem.adapter_code === item.adapter_code &&
            oldItem.fixture_type === item.fixture_type
          ) {
            if (  
              item.owner_email != oldItem.owner_email
            ) {
              const itemDictionary: ProjectDictionary = {
                issue: 'owner_change',
                project: item,
              }
              console.log(new Date(), `Owner was changed!`)
              projectsNeedMaintenance.push(itemDictionary)
            }
          }
        })

    let limitAdded_SkippingWarning = false
    if (item.contacts > item.contacts_limit) {
      const itemDictionary: ProjectDictionary = {
        issue: 'limit',
        project: item,
      }
      limitAdded_SkippingWarning = true
      projectsNeedMaintenance.push(itemDictionary)
    }

    if (!limitAdded_SkippingWarning) {
      //only add the warning if the limit was not added
      if (item.contacts > item.warning_at) {
        const itemDictionary: ProjectDictionary = {
          issue: 'warning',
          project: item,
        }
        projectsNeedMaintenance.push(itemDictionary)
      }
    }
  })

  return projectsNeedMaintenance
}
