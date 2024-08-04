
import cv2
import numpy as np

OUTPUT_PATH = "SJet.txt"
# Tester method to open the image from the text file and display it
# -------------------------

def test_image():
    with open(OUTPUT_PATH, "r") as f:
        image = eval(f.read())

        # Convert the 2D array to a numpy array
        image = np.array(image)

        # Convert to uint8
        image = np.uint8(image)
        
        # Display the image
        cv2.imshow("Image", image)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

if __name__ == "__main__":
    test_image()
    print('-------------------------') # Spacing
    print('BLOT Image Preprocessor') # Title
    print('Made by: Teja Koduru') # Author
    print('-------------------------') # Spacing
    print('Enjoy the program! :)') # End message
    print('-------------------------') # Spacing
    print('\n') # Spacing
        