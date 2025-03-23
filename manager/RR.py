import os
import shutil

def clean_directory(directory, exceptions):
    # Check if directory exists
    if not os.path.exists(directory):
        print(f"Directory {directory} does not exist")
        return
    
    # Get all items in the directory
    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        
        # Skip if item is in exceptions list
        if item_path in exceptions:
            continue
            
        # Delete files or directories
        try:
            if os.path.isfile(item_path):
                os.remove(item_path)
                print(f"Deleted file: {item_path}")
            elif os.path.isdir(item_path):
                shutil.rmtree(item_path)
                print(f"Deleted directory: {item_path}")
        except Exception as e:
            print(f"Error deleting {item_path}: {str(e)}")

def main():
    # Define the base directory
    base_dir = "RiceCrackers/read"
    
    # First cleanup: RiceCrackers/read directory
    read_exceptions = [
        os.path.join(base_dir, "0tools"),
        os.path.join(base_dir, "0zero"),
        os.path.join(base_dir, "0zero/0tools"),
        os.path.join(base_dir, "0zero.html")
    ]
    
    print("Cleaning RiceCrackers/read directory...")
    clean_directory(base_dir, read_exceptions)
    
    # Second cleanup: RiceCrackers/read/0zero directory
    zero_dir = os.path.join(base_dir, "0zero")
    zero_exceptions = [
        os.path.join(zero_dir, "0tools"),
        os.path.join(zero_dir, "chapter-0.html"),
        os.path.join(zero_dir, "chapter-1.html")
    ]
    
    print("\nCleaning RiceCrackers/read/0zero directory...")
    clean_directory(zero_dir, zero_exceptions)
    
    print("\nCleanup completed!")

if __name__ == "__main__":
    main()