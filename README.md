#onebox-email-aggregator

A feature-rich email aggregator platform that connects multiple Gmail accounts, syncs emails in real time using IMAP, stores them in Elasticsearch for fast querying, and provides a beautiful dashboard to view and take action on your emails — such as marking them as "Interested", sending Slack notifications, and triggering custom webhooks.

#Features

-> Real-time IMAP email synchronization
-> Email storage in Elasticsearch
-> Fetch and display all emails via REST API
-> Mark emails as "Interested"
-> Slack notifications for interested emails
-> Webhook integration for external systems

#Tech-Stack (Backend)
- Node.js
- TypeScript
- Express
- IMAPFlow (for email sync)
- Elasticsearch (Cloud)
- Axios

#Articture Overview

Gmail Accounts
     ↓ (IMAP)
 IMAPFlow (Node.js)
     ↓ (Real-time stream)
Elasticsearch ←→ Express API
     ↑                ↓
 React Frontend   Slack/Webhooks



/*************** Set Up Instructions ******************/

1. Clone 
git clone https://github.com/your-username/onebox-email-aggregator.git
cd onebox-email-aggregator

2. Configure your env file
   
PORT=5000
EMAIL_USER_1=youremail1@gmail.com
EMAIL_PASS_1=app_password1

EMAIL_USER_2=youremail2@gmail.com
EMAIL_PASS_2=app_password2

ELASTICSEARCH_URL=http://localhost:9200

ELASTIC_NODE=https://68bca32xxxxxxxxxxxxxxxxxx
ELASTIC_CLOUD_ID=your_elasticsearch_cloud_id
ELASTIC_USER=your_elastic_user
ELASTIC_PASS=your_elastic_password

SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook
WEBHOOK_URL=https://your-custom-webhook.com/notify


3. Install Dependencies

cd backend
npm install


4. Running and testing the service
cd backend
npm run dev
