FROM python:3.11
WORKDIR /backend
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONBUFFERED 1
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
COPY ./app ./app
COPY app/app.config ./app/app.config
EXPOSE 8000
WORKDIR /backend/app
RUN python create_db.py
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]