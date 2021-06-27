# Need this otherwise it loads up all the warnings related to Tensorflow and Keras
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

import tensorflow as tf
import numpy as np
import sys
from tensorflow import keras
from PIL import Image

# Only need the following 2 for initially training the model 
# from tensorflow.keras.datasets import mnist
# from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Reshape

if (os.path.exists('CNN_model')):
    # If the model exists load it in
    model = keras.models.load_model('CNN_model')

    # Get the path to image being classified
    path = sys.argv[1]

    with Image.open(path) as img:
        # Load the img, resize it, convert to grayscale, and dump into NP array
        img = img.resize((28,28)).convert('L')
        m = np.array(img)
        img.save('../imgs/resized_image.png')

        # Make the prediction
        label = np.argmax(model.predict(m.reshape(1,28,28,1)))
        print(label, end='', flush=True)
else:
    # Otherwise train a model
    print('Creating a new CNN model...')
    # Load in the MNIST dataset
    (X_train, Y_train), (X_test, Y_test) = mnist.load_data()
    
    # Convert X to be of typle float32 since original uint8 was not supported by model
    X = tf.cast(X_train, tf.float32)

    # Because we have 10 outputs, we need each row in Y to be 10 columns long that OHE the represented digit
    Y = tf.keras.utils.to_categorical(Y_train, num_classes=10)

    # Create the CNN
    model = keras.Sequential(
        [
        Reshape((28,28,1), input_shape=(28,28)),
        Conv2D(filters=128, kernel_size=2, strides=2, activation='relu'),
        MaxPooling2D(),
        Conv2D(filters=64, kernel_size=2, strides=2, activation='relu'),
        Flatten(),
        Dense(512, activation='relu'),
        Dense(10, activation='softmax')
        ]
    )

    # Compile the model
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    # Fit the model
    model.fit(X, Y, epochs=10, batch_size=32, validation_split=0.2)

    # Save the model
    model.save('CNN_model')
