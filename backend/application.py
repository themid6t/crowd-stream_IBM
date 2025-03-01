from app import create_app

app = create_app()

if __name__ == "__main__":
    # Get the IP address from a command line argument or use 0.0.0.0 to listen on all interfaces
    import sys
    host = sys.argv[1] if len(sys.argv) > 1 else '0.0.0.0'
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 5000
    
    print(f"Starting server on {host}:{port}")
    app.run(host=host, port=port, debug=True)
