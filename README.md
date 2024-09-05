# FileFrame - File Management System

**FileFrame** is a web-based file management system built with Node.js. It allows users to manage their files online with features such as signing up, logging in, uploading, downloading, creating folders, and more. The application also includes a premium plan for advanced features, integrated with Chapa payment.

## Features

- **User Authentication**: Users can sign up and log in to their accounts securely.
- **File Upload and Download**: Upload files and download them at any time.
- **Folder Management**: Create, rename, and delete folders to organize files efficiently.
- **Premium Plan**: Users can access additional features and storage by subscribing to a premium plan, integrated with Chapa payment.
- **Secure Payments**: Integrated with [Chapa](https://chapa.co) to handle secure transactions for the premium plan.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine
- [MongoDB](https://www.mongodb.com/) database set up (either locally or using a cloud service)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yoni-tad/file-management-with-node-js.git
   cd fileframe
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file:

   ```plaintext
   MONGO_URL=your_mongodb_connection_string
   CHAPA_SECRET_KEY=your_chapa_secret_key
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Visit `http://localhost:3000` in your web browser to start using the application.

## Usage

- **Sign Up**: Create a new account to start managing your files.
- **Login**: Access your existing account.
- **Manage Files**: Upload, download, and organize files into folders.
- **Upgrade to Premium**: Subscribe to the premium plan for more features and storage.

## Acknowledgements

This project was developed as a part of my learning journey with Node.js. I would like to thank the **Google Developer Student Clubs (GDSC) Addis Ababa University** for their excellent **Summer Online Back-End Program** which provided the learning resources and guidance to build this project.

## Contributing

# Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
