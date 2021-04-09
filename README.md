# flask-starter

## Database setup and configuration:

1. MongoDB is the backend database used in this project and the rest of these
   instructions assume you have it installed and running locally on localhost,
   port 5000.
2. A sample dataset is provided to populate the database with test data. Import
   it using the following command:

   ```
   $ mongorestore --gzip --archive=sample_db_dump.gz --nsInclude="messenger.*"
   ```

## .env Setup

1. Copy the file .env.sample to .env and in the new file, enter a secret key in
   the [SECRET_KEY] entry of the [JWT] section. Generate a new key with the
   command:

   ```
   $ python -c 'import os; print(os.urandom(16))'
   ```
2. Set ACCESS_TOKEN_EXPIRES to the number of hours you would like the JWT to be
   valid for.

## Starting the server:

1. Open a terminal and go to the server folder. Make sure you have **pipenv**
   installed (`pip install pipenv`)
2. Install the dependencies with `pipenv install`. This also creates a virtual
   environment, if there isn't one already.
3. Activate the virtual environment and start the app with `pipenv run flask run`

## Testing the application

1. From the server directory, ensure that the virtualenv is active and enter the
   following command to run the unit tests:

   ```
   $ python -m unittest discover -s test -v
   ```
