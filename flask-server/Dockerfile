FROM python:3.9

WORKDIR /app

ENV BASE_PATH=${BASE_PATH}

COPY . .

#Install Dependencies
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["gunicorn",  "app:app", "--bind", "0.0.0.0:5000"]

