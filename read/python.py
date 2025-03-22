import os
import shutil

def duplicate_and_rename(source_html, source_folder, list_file):
    # Check if source files exist
    if not os.path.exists(source_html):
        print(f"Error: Source HTML file '{source_html}' not found")
        return
    if not os.path.exists(source_folder):
        print(f"Error: Source folder '{source_folder}' not found")
        return
    if not os.path.exists(list_file):
        print(f"Error: List file '{list_file}' not found")
        return

    # Read names from list.txt
    with open(list_file, 'r') as f:
        names = [line.strip() for line in f if line.strip()]

    if not names:
        print("Error: No valid names found in list.txt")
        return

    # Get the base directory
    base_dir = os.path.dirname(source_html)
    
    # Process each name in the list
    for name in names:
        # Create new HTML filename
        html_ext = os.path.splitext(source_html)[1]  # Get .html extension
        new_html = os.path.join(base_dir, f"{name}{html_ext}")
        
        # Create new folder name
        new_folder = os.path.join(base_dir, f"{name}")
        
        try:
            # Copy HTML file with new name
            shutil.copy2(source_html, new_html)
            print(f"Created HTML: {new_html}")
            
            # Copy folder with new name
            shutil.copytree(source_folder, new_folder)
            print(f"Created folder: {new_folder}")
            
        except Exception as e:
            print(f"Error processing {name}: {str(e)}")

def main():
    # Example usage - you can modify these paths
    source_html = "RiceCrackers/read/Becoming-A-God-Starting-As-Water-Monkey.html"    # Your source HTML file
    source_folder = "RiceCrackers/read/Becoming-A-God-Starting-As-Water-Monkey"  # Your source folder
    list_file = "RiceCrackers/read/tools/list.txt"          # File containing list of names
    
    print("Starting duplication process...")
    duplicate_and_rename(source_html, source_folder, list_file)
    print("Process completed!")

if __name__ == "__main__":
    main()