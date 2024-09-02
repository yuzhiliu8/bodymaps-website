FROM "python:3.9"

WORKDIR /app

COPY . .

#Install Dependencies
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["gunicorn",  "server:app", "--bind", "0.0.0.0:5000"]

