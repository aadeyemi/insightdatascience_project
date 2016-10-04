//
//  extensions.swift
//  litali
//
//  Created by Yemi Arogunmati on 9/18/16.
//  Copyright © 2016 Zyn LLC. All rights reserved.
//

import Foundation
import UIKit

extension UIColor {
    convenience init(red: Int, green: Int, blue: Int) {
        assert(red >= 0 && red <= 255, "Invalid red component")
        assert(green >= 0 && green <= 255, "Invalid green component")
        assert(blue >= 0 && blue <= 255, "Invalid blue component")
        
        self.init(red: CGFloat(red) / 255.0, green: CGFloat(green) / 255.0, blue: CGFloat(blue) / 255.0, alpha: 1.0)
    }
    
    convenience init(netHex:Int) {
        self.init(red:(netHex >> 16) & 0xff, green:(netHex >> 8) & 0xff, blue:netHex & 0xff)
    }
}



extension String {
    var floatValue: Float {
        return (self as NSString).floatValue
    }
    var doubleValue: Double {
        return (self as NSString).doubleValue
    }
    
    var base64Encoded: String {
        if let plainData = (self as NSString).dataUsingEncoding(NSUTF8StringEncoding) {
            let base64String = plainData.base64EncodedStringWithOptions(NSDataBase64EncodingOptions(rawValue: 0))
            //println(base64String)
            return base64String
        }
        return ""
    }
    
    var base64Decoded: String {
        if let decodedData = NSData(base64EncodedString: self, options: NSDataBase64DecodingOptions(rawValue: 0)) {
            if let decodedString = NSString(data: decodedData, encoding: NSUTF8StringEncoding) {
                //println("\(decodedString)")
                return decodedString as String
            }
        }
        return ""
    }
    
    var revertHtmlEscapedChar: String {
        let option = NSStringCompareOptions.LiteralSearch
        var out = self
        out = out.stringByReplacingOccurrencesOfString("&quot;", withString: "\"", options: option, range: nil)
        out = out.stringByReplacingOccurrencesOfString("&gt;",   withString: ">",  options: option, range: nil)
        out = out.stringByReplacingOccurrencesOfString("&lt;",   withString: "<",  options: option, range: nil)
        out = out.stringByReplacingOccurrencesOfString("&#39;",  withString: "'",  options: option, range: nil)
        out = out.stringByReplacingOccurrencesOfString("&#92;",  withString: "\\", options: option, range: nil)
        //out = out.stringByReplacingOccurrencesOfString("&amp;",  withString: "&",  options: option, range: nil)
        return out
    }
    
    func replaceOccurencesOf (inSet: [String], with: [String]) -> String {
        let option = NSStringCompareOptions.LiteralSearch
        var output = self
        var outSet: [String] = with
        
        if inSet.count == outSet.count {
            for i in 0 ..< inSet.count {
                output = output.stringByReplacingOccurrencesOfString(inSet[i], withString: outSet[i], options: option, range: nil)
            }
        }
        
        return output
    }
    
    func rangeFromNSRange(nsRange : NSRange) -> Range<String.Index>? {
        let from16 = utf16.startIndex.advancedBy(nsRange.location, limit: utf16.endIndex)
        let to16 = from16.advancedBy(nsRange.length, limit: utf16.endIndex)
        if let from = String.Index(from16, within: self),
            let to = String.Index(to16, within: self) {
            return from ..< to
        }
        return nil
    }
    
    
    var isValidEmail: Bool {
        if self.rangeOfString("@") == nil || self.rangeOfString(".") == nil {
            return false
        }
        return true
    }
    
    var isStrongPwd: Bool {
        if matchesForRegexInText("[0-9]", text: self).count < 1 {
            return false
        } else if matchesForRegexInText("[a-z]", text: self).count < 1 {
            return false
        } else if matchesForRegexInText("[A-Z]", text: self).count < 1 {
            return false
        }
        return true
    }
    
    var removePunctuation: String {
        let regex = try! NSRegularExpression(pattern: "[^a-zA-Z0-9\\s+]", options: .CaseInsensitive)
        let str: String = regex.stringByReplacingMatchesInString(self, options: [], range: NSRange(0..<self.utf16.count), withTemplate: "")
        
        return str
    }
    
    var replaceMultispace: String {
        let regex = try! NSRegularExpression(pattern: "\\s+", options: .CaseInsensitive)
        let str: String = regex.stringByReplacingMatchesInString(self, options: [], range: NSRange(0..<self.utf16.count), withTemplate: " ")
        
        return str
    }
    
    var keepOnlyNumbers: String {
        let regex = try! NSRegularExpression(pattern: "[^0-9.]", options: .CaseInsensitive)
        let str: String = regex.stringByReplacingMatchesInString(self, options: [], range: NSRange(0..<self.utf16.count), withTemplate: "")
        
        return str
    }
    
    var replaceMultiSpaceAndNewLineWithSpace: String {
        let regex = try! NSRegularExpression(pattern: "[\\s\\r\\t\\n]+", options: .CaseInsensitive)
        let str: String = regex.stringByReplacingMatchesInString(self, options: [], range: NSRange(0..<self.utf16.count), withTemplate: " ")
        
        return str
    }
    
}

func matchesForRegexInText(regex: String!, text: String!) -> [String] {
    
    if let regex = try? NSRegularExpression (pattern: regex, options: []) {
        let results = regex.matchesInString(text, options: [], range: NSMakeRange(0, text.utf16.count))
        
        return results.map {
            text.substringWithRange(text.rangeFromNSRange($0.range)!)
        }
    } else {
        print("invalid regex", terminator: "")
        return []
    }
}


extension UILabel {
    
    func boldRange(range: Range<String.Index>) {
        if let text = self.attributedText {
            let attr = NSMutableAttributedString(attributedString: text)
            let start = text.string.startIndex.distanceTo(range.startIndex)
            let length = range.startIndex.distanceTo(range.endIndex)
            attr.addAttributes([NSFontAttributeName: UIFont.boldSystemFontOfSize(self.font.pointSize)], range: NSMakeRange(start, length))
            self.attributedText = attr
        }
    }
    
    func boldSubstring(substr: String) {
        let range = self.text?.rangeOfString(substr)
        if let r = range {
            boldRange(r)
        }
    }
}


