require 'json';

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "RNSafePadding"
  s.version      = package['version']
  s.summary      = package['description']
  s.homepage     = "https://github.com/rchs/react-native-toolkit.git"
  s.license      = package['license']
  s.author       = { "Ranjan Shrestha" => "ranjan@sharingapples.com" }
  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/rchs/react-native-toolkit.git", :tag => "master" }
  s.source_files = "ios/*.{h,m}"

  s.dependency "React"
end

