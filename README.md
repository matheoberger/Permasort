# PermacultureSort with Django

The goal of this algorithm is to sort vegetable by association, exposition, family, water need, width, height and soil need. It should help a farmer to create new associations, appropriate to the environment. 
ss the `permasort` and `permasite` apps in your Django project. Make sure to customize and configure them according to your specific needs.
To get started with the `permasort` Django project and `permasite` app, follow these steps:

1. Clone the `permasort` project from GitHub by running the following command:
    ```
    git clone https://github.com/username/permasort.git
    ```

2. Create a virtual environment for the project:
    ```
    python -m venv permasort-env
    ```

3. Activate the virtual environment:
    - For Windows:
      ```
      permasort-env\Scripts\activate
      ```
    - For macOS and Linux:
      ```
      source permasort-env/bin/activate
      ```

4. Install the required dependencies by running the following command:
    ```
    pip install -r permasort/requirements.txt
    ```

5. Navigate to the `permasort` directory:
    ```
    cd permasort
    ```

6. Run the migrations to set up the database:
    ```
    python manage.py migrate
    ```

7. Start the Django development server:
    ```
    python manage.py runserver
    ```

8. Open your web browser and access the `permasort` app at `http://localhost:8000/permasort/`.

9. To include the `permasite` app in your project, follow these additional steps:
    - Clone the `permasite` repository from GitHub:
      ```
      git clone https://github.com/username/permasite.git
      ```

    - Add `'permasite'` to the `INSTALLED_APPS` list in your Django project's `settings.py` file.

    - Include the `permasite` URLs in your project's `urls.py` file using the `include()` function.

    - Run the migrations for the `permasite` app:
      ```
      python manage.py migrate permasite
      ```

    - Restart the Django development server:
      ```
      python manage.py runserver
      ```

You can now access the `permasort` and `permasite` apps in your Django project. Customize and configure them according to your specific needs.
