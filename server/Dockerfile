# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
# Run update and install git if necessary for some specialized python packages
RUN apt-get update && apt-get install -y git build-essential && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV PYTHONUNBUFFERED=1

# Run the application
# Using shell form to allow variable expansion for $PORT (defaults to 8000 if not set)
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
