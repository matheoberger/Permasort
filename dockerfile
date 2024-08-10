# Use the official Python base image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django app code to the working directory
COPY . .

# Expose the port that the Django app will run on
EXPOSE 8000

# Set the command to run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]