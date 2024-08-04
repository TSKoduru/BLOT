# The goal of this script is to take an input image file,
# resize it to match the desired dimensions, and then
# greyscale it, returning the greyscaled image as a 2D array.

# Imports
# -------------------------
from PIL import Image # For opening and resizing images
import argparse, sys # For command line arguments

# Constants, DO NOT CHANGE
# -------------------------
WIDTH = 125
HEIGHT = 125
IMAGE_PATH = ""
OUTPUT_PATH = ""

# Helper method
# -------------------------

"""
preprocess_image
------------

Resizes an image to the desired dimensions and greyscales it.
Uses OpenCV's resize method to do so, preserving aspect ratio.

Keep in mind, this may make the image extremely small to fit into
the desired dimensions, especially if the aspect ratio is not 1:1.

Parameters:
- image_path: The path to the image to resize
- width: The desired width
- height: The desired height

Returns:
- The resized image as a 2D array

"""

def preprocess_image(image_path):
    
    canvas = Image.new('L', (WIDTH, HEIGHT), (255))

    # Read the image
    img = Image.open(image_path)

    # Convert the image to greyscale
    img = img.convert('L')

    # Preserve aspect ratio of the image and resize it so it fits into 
    # the given dimensions.

    img = img.resize((WIDTH, HEIGHT))

    # Rotate the image clockwise by 90 degrees
    # For some reason the blot plotter is rotated by 90 degrees,
    # so this is to correct for that.

    img = img.rotate(-90)

    # Insert the image onto the canvas, in the center
    canvas.paste(img, (int((WIDTH - img.width) / 2), int((HEIGHT - img.height) / 2)))
    

    return canvas


# Main method
# -------------------------

def main():

    global IMAGE_PATH, OUTPUT_PATH
    print('\n-------------------------') # Spacing
    print('BLOT Image Preprocessor') # Title
    print('Made by: Teja Koduru') # Author
    print('-------------------------') # Spacing

    parser = argparse.ArgumentParser(
                    prog='preprocessor.py',
                    description='Preprocesses an image for use in BLOT',
                    epilog='Enjoy the program! :)')
    
    parser.add_argument('-i', '--input', required=True, 
                        help='Input image path') 
    parser.add_argument('-o', '--output', required=True,
                        help='Output file path')

    args = parser.parse_args()

    # Check if the user has provided an input image
    if args.input: IMAGE_PATH = args.input
    else:
        print("No input image provided. Exiting...")
        sys.exit(1)
    
    # Check if the user has provided an output file
    if args.output: OUTPUT_PATH = args.output
    else:
        print("No output file provided. Exiting...")
        sys.exit(1)

    image = preprocess_image(IMAGE_PATH)
    # Save the image to a text file, so we can copy it into our JS code
    # This means including the brackets and commas
    with open(OUTPUT_PATH, "w") as f:
        f.write(str(image))
    
    print('-------------------------')
    print("Image preprocessed and saved to " + OUTPUT_PATH + ".\n")
    print("You can now use the contents of the as an input to blot.js. Enjoy!\n")

# Run the main method
# -------------------------
if __name__ == "__main__":
    main()
        