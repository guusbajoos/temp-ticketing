## Overview
DownloadReport component handles download button. Currently this component supports csv file type.

There are three report types currently supports:

- CUSTOMER_INTERACTION
- COMMENT_LOGS
- SLA

## Functions

### Adapter

Adapter acts as data transformation between tickets objects with specified report types. 

There are three function for adapter (look for report types).

#### ticketsToSLA

This function transforms tickets to SLA

SLA is defined with the following columns

| Ticket Number | Patient ID | Assigned To Team | Assigned To Agent | Status | Assigned Date Time | Aging Status | 
| ------------- | ---------- | ---------------- | ----------------- | ------ | ------------------ | ------------ |
|               |            |                  |                   |        |                    |              |

To populate these items, we utilize attribute `histories` inside each of ticket objects.

Below are methods we use to generate SLA 

1. For each tickets objects
2. initialize new object
```js
let slaItems = [];
const histories = ticket.histories;
let slaItem = {
      number: ticket.number,
      patientId: ticket.patientId,
      team: ticket.team,
      agent: ticket.agent,
      status: ticket.status,
      assignedAt: ticket.updatedAt,
    };
```
This `slaItem` object represents the latest ticket value
3. After that, we push slaItem to current `slaItems`
4. If history is not empty, we do following things
   1. Group histories by timestamp
      ```js
      const historiesByCreatedAt = _.groupBy(histories, function (history) {
        return moment(
          formatReportDateTime(history.createdAt),
          'MM/DD/YYYY HH:mm:ss'
        ).valueOf();
      });
      ```
   2. sort groupedHistories by keys (Asc and desc)
      ```js
       const descSortedTimestamps = _.keys(historiesByCreatedAt)
        .sort()
        .reverse();
      const ascSortedTimestamps = _.keys(historiesByCreatedAt).sort();

      let descHistories = [];
      descSortedTimestamps.forEach(function (key) {
        descHistories.push(historiesByCreatedAt[key]);
      });
      let ascHistories = [];
      ascSortedTimestamps.forEach(function (key) {
        ascHistories.push(historiesByCreatedAt[key]);
      });
      ```
   3. Initiate a new ascObjects with the following props
      ```js
      {
         "columns": [], // represent what column has been changed
         "timestamp": "<string>" // represents history.createdAt
         "hasBeenSelected": false // indicates if current ascObject has been picked or not
      }
      ```
5. Mutate accordingly for each of histories. We do deep clone 
6. Reverse `slaItems` collection in order to make first item will be the very first record
7. Recalculate assigned date. Calculation is done by using data provided by `ascObjects` and SLA Items
8. Calculate SLA aging
9. Reformat assigned date to conform with 24 hours format
