Interactive CLI for retrieving formulary via the [MMIT API](https://api.mmitnetwork.com/)

##Getting Started

- Clone the repo: `git clone https://github.com/StevenChin/mmit-formulary-cli.git`
- Install dependencies: `npm install --production`
- Start app: `npm start`

Once the application is started, you will be prompted for the inputs (`username`, `password`, `product/drug name`, `planId`) to request plan formulary from MMIT
and to make selections where multiple products/drugs are being returned.

##Example Usage
- Enter user credentials, product and plan information:<br><br>
  ![user prompt](https://www.dropbox.com/s/r5l4a7k6h7u5feb/step1.png?dl=1 "Step One: User Prompt")
  <br><br>
- Select product:<br><br>
  ![product selection](https://www.dropbox.com/s/tc9pu1486gpv0wq/step2a.png?dl=1 "Step Two: Product Selection")
  <br><br>
- View results:<br><br>
  ![results summary](https://www.dropbox.com/s/lq945zoch6k0qwu/step2b.png?dl=1 "Step Two: Results Summary")

##Future Release items:
- Limit product fields being displayed
- Support for plan name