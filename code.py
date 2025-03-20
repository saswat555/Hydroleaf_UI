import os
import argparse

def write_code_to_file(app_dir, output_file, extensions):
    with open(output_file, "w", encoding="utf-8") as out_f:
        # Walk through the app folder recursively
        for root, dirs, files in os.walk(app_dir):
            # Exclude __pycache__ and node_modules directories from traversal
            dirs[:] = [d for d in dirs if d not in ('__pycache__', 'node_modules')]
            for file in files:
                # Only process files that end with one of the specified extensions
                if extensions and not any(file.endswith(ext) for ext in extensions):
                    continue
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, "r", encoding="utf-8") as in_f:
                        content = in_f.read()
                except Exception as e:
                    print(f"Could not read file {file_path}: {e}")
                    continue
                # Write a header with the file path then the file content
                out_f.write(f"----- {file_path} -----\n")
                out_f.write(content)
                out_f.write("\n\n")  # Add spacing between files

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Write essential code files to an output file.")
    parser.add_argument("--app_dir", type=str, default="src",
                        help="Directory of the app files (default: src)")
    parser.add_argument("--output_file", type=str, default="code.txt",
                        help="Name of the output file (default: code.txt)")
    parser.add_argument("--extensions", type=str, nargs="*",
                        default=[".ts", ".html", ".scss", ".css", ".json"],
                        help="List of file extensions to include (default: .ts .html .scss .css .json)")
    
    args = parser.parse_args()
    write_code_to_file(args.app_dir, args.output_file, args.extensions)
    print(f"Code from '{args.app_dir}' has been written to '{args.output_file}'.")
