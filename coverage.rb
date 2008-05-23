#!/usr/bin/ruby
#
# JS functions test-coverage utility
# Author: Maxim Chernyak (hakunin)
# Email: max@bitsonnet.com
# Website: http://mediumexposure.com
   

path = ARGV[0]

if path.nil? or path.empty? or path =~ /\/$/ 
  puts 'Need path without trailing slash'
  exit(0)
end

p = Dir.new(path)

methods_all = Array.new
tests_all = Array.new
methods_covered = Array.new
tests_used = Array.new

while filename = p.read
  next if filename =~ /^\./ or File.directory?(path + '/' + filename)
  testfile = filename.split('.')
  testfile.pop
  testfile << 'html'
  testfile = 'test/' + testfile.join('.')
  
  
  File.open( path + '/' + filename, 'r') do |file|
    while (line = file.gets)
      r = /(.*)=\s*function\s*\(/i.match(line)
      method = r.nil? ? nil : r[1].strip
      if !method.nil? && method[0,1] == method[0,1].upcase && method[0,1] =~ /\w/
        methods_all << method
      end
    end
  end
  
  if File.exists?(path + '/' + testfile)
    File.open( path + '/' + testfile ) do |file|
      while (line = file.gets)
        r = /test(\w+):\s*function\(/.match(line)
        tests_all << r[1] unless r.nil?
      end
    end
  end
end

methods_all.each do |method|
  tests_all.each do |test|
    if method.split('.').join.upcase == test.upcase
      methods_covered << method
      tests_used << test
    end
  end
end


puts "---- COULDN'T MATCH THESE TESTS ----"
puts tests_all - tests_used
puts "\n---- METHODS NOT COVERED ----"
puts methods_all - methods_covered
puts "\n---- METHODS COVERED ----"
puts methods_covered