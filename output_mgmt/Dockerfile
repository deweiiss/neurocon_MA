FROM python:3.11-slim

WORKDIR /app

# Install gcc for compiling python_bcrypt
RUN apt-get update && apt-get install -y gcc

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set PYTHONPATH to ensure all modules are discoverable
ENV PYTHONPATH="${PYTHONPATH}:/app"

CMD ["flask", "run", "--host=0.0.0.0", "--port=5003"]